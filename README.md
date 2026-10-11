# GMT 458 – Web GIS | Assignment 1: Personal Web Page

**Student Portfolio Web Page & Web GIS Application**  
**Author:** Aslı Özteker  
**Institution:** Hacettepe University, Faculty of Engineering, Department of Geomatics Engineering  

---

## 📌 Project Overview

This website is developed for **GMT 458 - Web GIS** course as a personal academic portfolio and web mapping platform. Following clean academic faculty web design standards (e.g., `https://yunus.hacettepe.edu.tr/~banbar/`), the layout is minimalist, responsive, and distraction-free.

The project incorporates two open-source web mapping libraries (**Leaflet** and **OpenLayers**), subtle CSS keyframe animations, responsive tables with vector imagery, and technical solutions to the two web GIS challenges outlined in the assignment brief.

---

## 🗺️ Live Maps & Geographic Coordinates

### 1. Leaflet Map – Academic Life (`index.html`)
* **Map Engine:** Leaflet v1.9.4
* **Scope:** Ankara / Beytepe Campus
* **Target Location:** Hacettepe University Department of Geomatics Engineering
* **Coordinates:** `39.86574196299712, 32.733949892817506` (WGS84 Lat/Lon)
* **Features:** Layer switcher (CartoDB Voyager Street Map, Esri Street Map, Esri Satellite Imagery), custom vector pin marker with popup, focus controls.

### 2. OpenLayers Map – Internship Experiences (`resume.html`)
* **Map Engine:** OpenLayers v8.2
* **Scope:** Turkey overview with zoom-in focus on Ankara internship sites
* **Projection:** EPSG:3857 (Web Mercator), source EPSG:4326
* **Target Internship Locations:**
  1. **General Directorate of Highways (4th Regional Directorate):** `39.9572848124613, 32.85022518021346`
  2. **Küre Engineering:** `39.88448294796374, 32.81563373589881`
  3. **Doruk Surveying & Engineering:** `39.88491243424993, 32.817468947570866`
* **Features:** Interactive click popup overlay, distinct non-overlapping label styling, basemap toggle (Street vs. Satellite), smooth view animations.

---

## 🎯 Technical Solutions to Assignment Issues

### ⚡ Issue 1: Zoom Threshold (Preventing Marker Overlap) (%10)
* **Problem:** Küre Engineering and Doruk Surveying are located in close physical proximity (~160 meters apart). At country or regional zoom levels, their markers and labels overlap, causing visual clutter.
* **OpenLayers Solution (`js/openlayers-map.js`):**
  A zoom threshold is applied to the individual feature vector layer using `minZoom: 11`. When zoomed out (Zoom < 11), a single regional summary cluster marker (`📍 Ankara (3 Internships)`) is shown. As the user zooms in (Zoom ≥ 11), individual internship locations reveal themselves with distinct opposite label offsets (`textOffset: [-75, -30]` and `[75, -30]`).
* **Leaflet Solution (`js/leaflet-map.js`):**
  Detailed sub-facilities (Photogrammetry Lab, Geodesy Station, Remote Sensing Unit) are dynamically toggled via `map.getZoom() >= 15`.

### 🌍 Issue 2: Earth Repeating Itself When Zoomed Out (%10)
* **Problem:** Web mapping engines by default repeat world tile columns infinitely across the antimeridian (-180° / +180°).
* **OpenLayers Solution (`js/openlayers-map.js`):**
  Configured `wrapX: false` on the XYZ tile source and restricted map panning using `view.extent: maxExtent`:
  ```javascript
  const cartoVoyagerSource = new ol.source.XYZ({
    url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    wrapX: false // Prevents world repetition
  });
  ```
* **Leaflet Solution (`js/leaflet-map.js`):**
  Tile layers set `noWrap: true` and `bounds: worldBounds`. The map view enforces `maxBounds: worldBounds` with `maxBoundsViscosity: 1.0` to lock the boundary securely.

---

## 📂 Site Architecture (4 HTML Files) (%15)

1. `index.html` – **Home:** Author introduction, editable bio placeholder, and Leaflet Ankara Hacettepe map.
2. `resume.html` – **Resume & Skills:** OpenLayers internship map, internship experience table with images, and technical skills matrix.
3. `courses.html` – **Past & Active Courses:** Academic curriculum tables with course icons, credits/ECTS, topics, and grades.
4. `projects.html` – **Projects:** Portfolio table of Web GIS, remote sensing, and geomatics projects.

---

## 🎨 CSS Animations & Tabular Information (%20)

* **CSS Animations (`css/animations.css` - %10):**
  Smooth entry transition (`fadeInSimple`), subtle map status pulse (`softPulse`), and smooth interactive hover effects.
* **Tabular Information with Images (`resume.html` & `courses.html` - %10):**
  Structured responsive data tables containing custom SVG emblems and logos (`assets/images/`), category tags, and duration metrics.

---

## 🤖 Artificial Intelligence (AI) Usage Declaration

In compliance with the assignment instructions:
1. **Specific Issues Learned / Solved Using AI:**
   * Preventing `403 Access Blocked` HTTP errors caused by OpenStreetMap volunteer tile usage policy under local `file:///` protocols by substituting reliable CartoDB Voyager and Esri XYZ basemap services.
   * Coordinate ordering conventions (`[lat, lng]` in Leaflet vs. `[lon, lat]` in OpenLayers) and projection transformations with `ol.proj.fromLonLat`.
   * Enforcing `wrapX: false` in OpenLayers and `noWrap: true` + `maxBoundsViscosity: 1.0` in Leaflet to solve world tile replication.
2. **Estimated Total AI Usage:** Approximately 45 - 60 minutes.

---

## 🚀 GitHub Pages Deployment & Git Commit Plan (%5)

The local Git repository contains commits scheduled across 3 separate days:
* `2026-10-09`: Project structure, typography, and responsive navbar
* `2026-10-10`: Leaflet map implementation for Hacettepe and course tables
* `2026-10-11`: OpenLayers internship map, Issue 1 & 2 solutions, and full English localization

### Deploy to GitHub Pages:
```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\web_gis_portfolio
git remote add origin https://github.com/asliozteker/<repository-name>.git
git push -u origin main
```
Navigate to your repository on GitHub: **Settings > Pages > Branch: main / root** and click **Save**.
