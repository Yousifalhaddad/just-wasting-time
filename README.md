# Windows-Style Firmware/Recovery Prank

Harmless prank page that simulates a firmware check, then — on **ESC** — a fake factory-reset with fast terminal spam, then a Windows-like boot & recovery screen. Exit via **Ctrl+X ×3**.

## Files
- `index.html` — everything in one page, no assets required.
- `prank-guard.js` — optional drop-in blocker for shortcuts (best-effort).

## Run locally
Just open `index.html` in a browser. For best effect, host via any static server and open in Chromium/Edge/Firefox.

## Deploy to GitHub Pages
1. Create a repo (e.g. `just-wasting-time`) and push these files to the root or `/docs`.
2. Settings → Pages → Source: **Deploy from branch** → select branch (`main`) and folder (`/` or `/docs`).

## Notes
- Keyboard Lock API & blocking of Windows key are **best effort** — OS may override.
- No data is touched/sent anywhere. All detection is from public browser APIs.
