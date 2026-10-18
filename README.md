# Transpose — Instrument & Voice Transposer

The piano is a C instrument. Its key is the key of the music.
This app shows what every instrument and voice plays from there.

- **One instrument to another** — pick any two instruments or voices (piano ↔ tenor sax by default, both changeable), tap a key, chord, or note, and read the transposed answer.
- **Build the band** — add unlimited players. Horns and voices each take one note of the chord (tap "Plays the…" to choose which); piano, guitar, and keys get the whole chord.
- **Works offline (PWA)** — installable to the home screen; everything computes on-device, fonts are self-hosted, no internet needed after first load.
- **SCN Technologies signature accessibility** — colorblind-friendly shapes + outlines (never color alone), calm mode, large text, dark mode, English/Español — top-right ♿ button.
- A built-in **quick-tour video** at the top shows the app being used.

## Run it

```bash
npm install
npm run build   # outputs static site to dist/ — index.html is the entry
```

## Deploy to a subdomain (Vercel — works from a phone browser)

1. Push this folder to a GitHub repo.
2. On your phone: go to **vercel.com** → **Add New → Project** → import the repo. Vercel auto-detects Vite (`vercel.json` is included — no settings to touch) → **Deploy**.
3. In the project → **Settings → Domains** → add `transpose.scn.ninja`.
4. At your DNS provider (wherever scn.ninja is hosted), add a **CNAME** record:
   `transpose` → `cname.vercel-dns.com`
5. Done — HTTPS is automatic. No npm or computer required at any step.

(GitHub Pages also works: upload the contents of `dist/`.)
