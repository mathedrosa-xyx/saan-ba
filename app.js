// SAAN BA? — clickable prototype (hard-coded data in data.js)
const $ = id => document.getElementById(id);
const ICON = { jeep: "🚙", bus: "🚌", trike: "🛺", van: "🚐", walk: "🚶", boat: "⛵" };
const MC = { jeep: "#3B82F6", bus: "#F59E0B", trike: "#EC4899", van: "#10B981", walk: "#9CA3AF", boat: "#06B6D4" };

const LOGO = `<svg width="130" height="130" viewBox="0 0 100 100">
  <rect x="4" y="4" width="92" height="92" rx="26" fill="#E8487A"/>
  <text x="50" y="80" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="800" font-size="62" fill="#fff">S</text>
  <g transform="translate(19 -2) scale(.62)">
    <path d="M14 55c0-5 16-10 36-10s36 5 36 10-16 9-36 9-36-4-36-9z" fill="#1D1D2B"/>
    <path d="M32 48l5-22c1-5 6-5 10-2l3 2 3-2c4-3 9-3 10 2l5 22z" fill="#1D1D2B"/>
    <rect x="32" y="41" width="36" height="6" fill="#4FD1C5"/></g>
  <circle cx="74" cy="76" r="6" fill="#4FD1C5"/></svg>`;

// ---------- state ----------
let saved = [];
try { saved = JSON.parse(localStorage.getItem("saanba.saved")) || []; } catch (e) {}
const persist = () => { try { localStorage.setItem("saanba.saved", JSON.stringify(saved)); } catch (e) {} };
let current = null, expanded = false, map, layer;

// ---------- navigation ----------
function go(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === id));
  if (id === "home") renderHome();
  if (id === "list") renderList();
  if (id === "search") { renderResults(); setTimeout(() => $("toInput").focus(), 300); }
  if (id === "map") { initMap(); setTimeout(() => map.invalidateSize(), 300); if (!current) idleSheet(); }
}
document.addEventListener("click", e => { const g = e.target.closest("[data-go]"); if (g) go(g.dataset.go); });

function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 1800); }
const P = k => PLACES[k];
const modes = r => r.steps.map((s, i) => `${i ? "›" : ""}<div class="m" style="background:${MC[s[0]]}22">${ICON[s[0]]}</div>`).join("");
const row = r => `<button class="row" data-route="${r.id}"><div class="bar"></div>
  <div><b>${P(r.to).short}</b><small>from ${P(r.from).short} · ${r.eta}</small></div><div class="f">₱${r.fare}</div></button>`;
document.addEventListener("click", e => { const b = e.target.closest("[data-route]"); if (b) openRoute(b.dataset.route); });

// ---------- home ----------
function renderHome() {
  const list = ROUTES.filter(r => saved.includes(r.id));
  $("savedList").innerHTML = list.length ? list.map(row).join("")
    : `<div class="empty">Wala ka pang saved routes. Pick a spot below or search, then tap ★ Save route.</div>`;
  $("spots").innerHTML = Object.entries(PLACES).filter(([, p]) => p.spot).map(([k, p]) =>
    `<button class="spot" data-spot="${k}" style="background:linear-gradient(135deg,${p.grad[0]},${p.grad[1]})"><span>${p.short}</span></button>`).join("");
}
document.addEventListener("click", e => {
  const s = e.target.closest("[data-spot]"); if (!s) return;
  const r = ROUTES.find(r => r.to === s.dataset.spot); if (r) openRoute(r.id);
});

// ---------- search ----------
const origins = [...new Set(ROUTES.map(r => r.from))];
$("fromSel").innerHTML = `<option value="">Any</option>` + origins.map(k => `<option value="${k}">${P(k).name}</option>`).join("");
function renderResults() {
  const q = $("toInput").value.trim().toLowerCase(), f = $("fromSel").value;
  const res = ROUTES.filter(r => (!f || r.from === f) && (!q || P(r.to).name.toLowerCase().includes(q)));
  $("results").innerHTML = `<div class="sec">${res.length} route${res.length === 1 ? "" : "s"} found</div>` +
    (res.length ? res.map(row).join("") : `<div class="empty">Walang route pa diyan. Try "Dagupan" or "Manaoag".</div>`);
}
$("toInput").addEventListener("input", renderResults);
$("fromSel").addEventListener("change", renderResults);

function renderList() { $("allRoutes").innerHTML = ROUTES.map(row).join(""); }

// ---------- map ----------
function initMap() {
  if (map) return;
  map = L.map("leaflet", { zoomControl: false, attributionControl: true }).setView([16.02, 120.6], 10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(map);
  layer = L.layerGroup().addTo(map);
  map.on("click", e => placeDestination(e.latlng));
}
const pin = c => L.divIcon({ className: "", html: `<div class="pin" style="background:${c}"></div>`, iconSize: [26, 26], iconAnchor: [13, 26] });

// User taps the map: snap to the nearest known destination and show its route
function placeDestination(ll) {
  let best = null, bd = Infinity;
  ROUTES.forEach(r => { const d = map.distance(ll, P(r.to).ll); if (d < bd) { bd = d; best = r; } });
  layer.clearLayers();
  L.marker(ll, { icon: pin("#4FD1C5") }).addTo(layer);
  toast(`Nearest known spot: ${P(best.to).short}`);
  setTimeout(() => openRoute(best.id), 600);
}

function drawRoute(r) {
  layer.clearLayers();
  const pts = [P(r.from).ll, ...r.steps.map(s => P(s[5]).ll)];
  L.polyline(pts, { color: "#E8487A", weight: 5, dashArray: "2 10", lineCap: "round" }).addTo(layer);
  L.marker(P(r.from).ll, { icon: pin("#E53935") }).addTo(layer).bindTooltip(P(r.from).short);
  L.marker(P(r.to).ll, { icon: pin("#4FD1C5") }).addTo(layer).bindTooltip(P(r.to).short);
  map.fitBounds(L.latLngBounds(pts), { paddingTopLeft: [40, 110], paddingBottomRight: [40, 330] });
}

function openRoute(id) {
  current = ROUTES.find(r => r.id === id); expanded = false;
  go("map"); setTimeout(() => drawRoute(current), 320);
  $("hint").textContent = `${P(current.from).short} → ${P(current.to).short}`;
  renderSheet();
}

function idleSheet() {
  $("hint").textContent = "Tap the map to place your destination";
  $("sheetBody").innerHTML = `<h3>Saan ka pupunta?</h3><p class="sub">Tap anywhere on the map and I'll find the nearest known route, or search by name.</p>
    <button class="btn wide" data-go="search">⌕ Search a place</button>`;
}

function renderSheet() {
  const r = current, saveOn = saved.includes(r.id);
  let h = `<h3>${P(r.to).name}</h3><p class="sub">from ${P(r.from).name}</p>
    <div class="stats"><div class="stat"><b>${r.km} km</b><span>Distance</span></div>
    <div class="stat"><b>${r.eta.replace(" min", "m").replace(" hrs", "h")}</b><span>ETA</span></div>
    <div class="stat"><b>₱${r.fare}</b><span>Fare</span></div></div>
    <div class="modes">${modes(r)}</div>`;
  if (!expanded) h += `<button class="btn wide" id="expand">View step-by-step ↑</button>`;
  else h += `<div class="steps">${r.steps.map((s, i) => `<div class="st" data-step="${i}">
        <div class="m" style="background:${MC[s[0]]}22">${ICON[s[0]]}</div>
        <div><b>${s[1]}</b><p>${s[2]} · ~${s[4]} min</p></div><div class="fare">${s[3] ? "₱" + s[3] : "Free"}</div></div>`).join("")}
      <div class="st"><div class="m" style="background:#E5393522">📍</div><div><b>Nandito ka na!</b><p>💡 ${r.tip}</p></div></div></div>
      <div class="acts"><button class="btn ghost" id="finish">Finish trip</button>
      <button class="btn" id="save">${saveOn ? "★ Saved" : "☆ Save route"}</button></div>
      <button class="link wide" id="collapse" style="margin-top:12px">Collapse ↓</button>`;
  $("sheetBody").innerHTML = h;
}

$("sheet").addEventListener("click", e => {
  if (!current) return;
  const t = e.target.closest("button,.st,.grab"); if (!t) return;
  if (t.id === "expand" || (t.id === "grab" && !expanded)) { expanded = true; renderSheet(); }
  else if (t.id === "collapse" || t.id === "grab") { expanded = false; renderSheet(); }
  else if (t.id === "save") {
    if (saved.includes(current.id)) { saved = saved.filter(x => x !== current.id); toast("Removed from saved"); }
    else { saved.push(current.id); toast("★ Route saved!"); }
    persist(); renderSheet();
  }
  else if (t.id === "finish") { toast("Ingat! Trip finished 🎉"); current = null; layer.clearLayers(); setTimeout(() => go("home"), 900); }
  else if (t.dataset.step) t.classList.toggle("done"); // tap a step to tick it off
});

// ---------- boot ----------
$("logoBig").innerHTML = LOGO;
renderHome();
