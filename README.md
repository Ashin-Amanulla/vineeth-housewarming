# Neeharam · Housewarming Invitation

Invitation website for the housewarming of **Vineeth & Aparna**, Saturday 02 January 2027, 4:00 PM onwards.

Plain HTML/CSS/JS with no build step.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Publish on GitHub Pages

1. Create a repo and push these files to the `main` branch.
2. Go to **Settings → Pages**, set *Source* to **Deploy from a branch**, then pick `main` / `(root)`.
3. The site goes live at `https://<username>.github.io/<repo>/`.
4. For WhatsApp link previews, change the `og:image` tag in `index.html` to the full URL,
   e.g. `https://<username>.github.io/<repo>/assets/invitation-night.jpg`.

## Tips

- Adding `#venue` or `?open` to the link skips the opening screen.
- The moon/sun button switches between the night (navy + gold) and day (cream + green) themes.
- Event details are in `index.html`, the countdown time is in `js/main.js`, and the calendar file is `assets/housewarming.ics`.
