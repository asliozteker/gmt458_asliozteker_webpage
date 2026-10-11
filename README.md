# GMT 458 – Web GIS | Assignment 1: Personal Web Page

**Student:** Aslı Özteker  
**Department:** Geomatics Engineering, Hacettepe University  

---

## 📌 Overview

A clean, minimalist personal academic portfolio and web mapping site developed for **GMT 458 – Web GIS**, featuring interactive **Leaflet** and **OpenLayers** maps, tabular data with vector graphics, subtle CSS animations, and solutions to the two assignment challenges.

---

## 🗺️ Live Maps & Coordinates

1. **Leaflet Map – Academic Life (`index.html`):**
   * **Location:** Hacettepe University Department of Geomatics Engineering, Beytepe Campus
   * **Coordinates:** `39.865742° N, 32.733950° E`
   * **Basemaps:** Esri Street Map, Esri Topo Map, Esri Satellite Imagery (reliable, no API key required, no 403).

2. **OpenLayers Map – Internship Experiences (`resume.html`):**
   * **Locations:**
     * General Directorate of Highways (4th Regional Directorate): `39.957285° N, 32.850225° E`
     * Küre Engineering: `39.884483° N, 32.815634° E`
     * Doruk Surveying & Engineering: `39.884912° N, 32.817469° E`
   * **Basemaps:** Esri Street Map & Esri Satellite Imagery with one-click switcher.

---

## 🎯 Technical Solutions

* **Issue 1 (Marker Zoom Threshold):**  
  At small scales (Turkey overview), individual markers are grouped into a regional cluster to prevent overlapping (especially between Küre Engineering and Doruk Surveying, ~160 m apart). Individual markers only appear when zoomed in (`minZoom: 11` in OpenLayers; `Zoom >= 15` in Leaflet).

* **Issue 2 (Earth Repeating Horizontally):**  
  Prevented tile repetition when zooming out by using `wrapX: false` on OpenLayers XYZ tile source and `noWrap: true` with `maxBounds` in Leaflet.

---

## 📂 Web Pages

1. `index.html` – Home & Hacettepe Leaflet Map
2. `resume.html` – Resume, OpenLayers Internship Map & Experience Table
3. `courses.html` – Past & Active Courses Table with Icons
4. `contact.html` – Academic Contact, Institutional Email & Location

---

## 🤖 AI Usage Declaration

* **What was learned from AI:**  
  1. Resolving tile 403 / watermark issues by integrating reliable Esri XYZ basemaps.  
  2. Applying `wrapX: false` and `minZoom: 11` in OpenLayers to prevent world repetition and marker overlap.  
  3. Proper coordinate order (`[lat, lng]` in Leaflet vs. `[lon, lat]` with `ol.proj.fromLonLat` in OpenLayers).
* **Estimated AI Usage Time:** Approximately 45–60 minutes.

---

## 🚀 Deployment

The repository includes git commits made across different days. To publish on GitHub Pages:
```bash
git push -u origin main
```
Enable GitHub Pages in repository **Settings > Pages > Branch: main / root**.
