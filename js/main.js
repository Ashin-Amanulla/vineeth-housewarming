(function () {
  'use strict';

  // 4:00 PM IST, Saturday 02 January 2027
  var EVENT_START = new Date('2027-01-02T16:00:00+05:30');
  var EVENT_END = new Date('2027-01-02T21:00:00+05:30');

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- brass lamps ---------- */
  var tpl = document.getElementById('lamp-tpl');
  document.querySelectorAll('.lamp').forEach(function (slot) {
    slot.appendChild(tpl.content.cloneNode(true));
  });

  /* ---------- opening cover ---------- */
  var cover = document.getElementById('cover');
  var openBtn = document.getElementById('open-btn');

  function openInvite() {
    if (body.classList.contains('opened')) return;
    cover.classList.add('is-open');
    cover.setAttribute('aria-hidden', 'true');
    body.classList.remove('locked');
    body.classList.add('opened');
    startPetals();
  }

  // Links shared with #venue (or ?open) skip straight to the invitation.
  if (location.hash || /[?&]open\b/.test(location.search)) {
    cover.classList.add('is-open');
    openInvite();
  } else {
    body.classList.add('locked');
    openBtn.addEventListener('click', openInvite);
    setTimeout(function () { openBtn.focus({ preventScroll: true }); }, 300);
  }

  /* ---------- falling petals ---------- */
  var petalsStarted = false;
  function startPetals() {
    if (petalsStarted || reduceMotion) return;
    petalsStarted = true;
    var box = document.getElementById('petals');
    var count = window.innerWidth < 600 ? 14 : 24;
    var reds = ['#c8102e', '#e0314b', '#f05a5a', '#ff8a3d'];
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      var jasmine = Math.random() < 0.55;
      p.className = 'petal' + (jasmine ? ' petal--jasmine' : '');
      p.style.left = (Math.random() * 100).toFixed(2) + '%';
      p.style.setProperty('--s', (jasmine ? 7 + Math.random() * 5 : 9 + Math.random() * 7).toFixed(1) + 'px');
      p.style.setProperty('--t', (11 + Math.random() * 10).toFixed(1) + 's');
      p.style.setProperty('--delay', (-Math.random() * 20).toFixed(1) + 's');
      p.style.setProperty('--sway', (15 + Math.random() * 45).toFixed(0) + 'px');
      if (!jasmine) p.style.setProperty('--c', reds[i % reds.length]);
      box.appendChild(p);
    }
  }

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- countdown ---------- */
  var cdGrid = document.getElementById('countdown');
  var cdMsg = document.getElementById('countdown-msg');
  var units = {};
  cdGrid.querySelectorAll('[data-unit]').forEach(function (el) { units[el.dataset.unit] = el; });

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function tick() {
    var now = new Date();
    var diff = EVENT_START - now;
    if (diff <= 0) {
      cdGrid.hidden = true;
      cdMsg.hidden = false;
      cdMsg.textContent = now < EVENT_END
        ? 'The celebration has begun — come on in!'
        : 'Thank you for being part of our new beginning.';
      return false;
    }
    var s = Math.floor(diff / 1000);
    units.days.textContent = Math.floor(s / 86400);
    units.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    units.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    units.seconds.textContent = pad(s % 60);
    return true;
  }
  if (tick()) {
    var timer = setInterval(function () { if (!tick()) clearInterval(timer); }, 1000);
  }

  /* ---------- theme toggle ---------- */
  var toggle = document.getElementById('theme-toggle');
  var cardBtn = document.getElementById('card-btn');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-label', theme === 'night' ? 'Switch to day theme' : 'Switch to night theme');
    cardBtn.href = 'assets/invitation-' + theme + '.jpg';
    themeMeta.setAttribute('content', theme === 'night' ? '#0a1322' : '#f5ecdc');
  }
  applyTheme(root.getAttribute('data-theme') || 'night');

  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'night' ? 'day' : 'night';
    applyTheme(next);
    try { localStorage.setItem('neeharam-theme', next); } catch (e) {}
  });

  /* ---------- share ---------- */
  var toastEl = document.getElementById('toast');
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  document.getElementById('share-btn').addEventListener('click', function () {
    var url = location.href.split('#')[0];
    var data = {
      title: 'Housewarming · Vineeth & Aparna',
      text: 'You are invited to the housewarming of Neeharam — Saturday, 02 January 2027, 4:00 PM onwards.',
      url: url
    };
    if (navigator.share) {
      navigator.share(data).catch(function () {});
      return;
    }
    var full = data.text + '\n' + url;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(full).then(
        function () { toast('Invitation link copied'); },
        function () { toast('Copy this link: ' + url); }
      );
    } else {
      toast('Copy this link: ' + url);
    }
  });
})();
