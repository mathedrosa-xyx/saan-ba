# SAAN BA? — clickable prototype

Hard-coded commute guide prototype (HTML/CSS/JS).

## Run
1. Open this folder in VS Code (File → Open Folder → `saan-ba`).
2. Install the **Live Server** extension, right-click `index.html` → **Open with Live Server**.
   (Or just double-click `index.html` to open it in Chrome.)
3. Needs internet for the map tiles and fonts.

## Files
- `index.html` — all screens (Welcome, Home, Search, Route list, Map + Guide)
- `style.css` — Night Rider theme
- `app.js` — navigation, map, tap-to-place destination, save route
- `data.js` — hard-coded places and routes (edit here to add your own commutes)

## Demo flow
Welcome → Tara, Biyahe! → tap a famous spot / search / tap anywhere on the map →
route overview → View step-by-step → tap steps to tick them off → Save route / Finish trip.

Fares and ETAs are sample estimates; coordinates are approximate.
