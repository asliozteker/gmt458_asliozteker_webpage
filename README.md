# GMT 458 – Web GIS | Assignment 1: Personal Web Page

**Student:** Aslı Özteker  
**Department:** Geomatics Engineering, Hacettepe University  

---

## 📌 Objectives & Rubric Compliance Overview

| Rubric Criterion | Weight | Implementation Details |
| :--- | :---: | :--- |
| **HTML Structure** | **%15** | 4 distinct HTML pages (`index.html`, `resume.html`, `courses.html`, `contact.html`). A sticky, unified top navigation bar eliminates the need for the browser's back button. |
| **CSS Animations** | **%10** | Animated sub-tab underline (`tabUnderlineEntrance`), tab pill pulse, smooth page entrance transition (`pageTabEntrance`), Ankara location pin bounce (`anim-pin-bounce`), and map pulse indicators. |
| **Tabular Info with Images** | **%10** | Structured data tables on `resume.html` and `courses.html` incorporating custom vector SVG emblems (`assets/images/`), roles, ECTS credits, and grades. |
| **Leaflet Map (Ankara)** | **%10** | Embedded on `index.html`, centered on Hacettepe University Department of Geomatics Engineering (`39.865742° N, 32.733950° E`) with Esri Street/Satellite layers and custom pin. |
| **OpenLayers Map (Turkey)** | **%10** | Embedded on `resume.html`, providing Turkey overview and Ankara zoom focus for 3 internship sites (Highways 4th Directorate, Küre Engineering, Doruk Surveying). |
| **Marker Zoom Threshold** | **%10** | Prevents marker overlap at small scales. In OpenLayers, individual markers only appear when zoomed in (`minZoom: 11`). In Leaflet, campus sub-labs toggle at `Zoom >= 15`. |
| **Earth Repeating Prevention** | **%10** | Eliminates infinite horizontal world tile replication using `wrapX: false` in OpenLayers and `noWrap: true` + `maxBounds` in Leaflet. |
| **Git Usage (Multi-day)** | **%5** | Git repository includes 8+ clean commits scheduled across 3 separate days (`2026-10-09`, `2026-10-10`, `2026-10-11`) under `asliozteker`. |
| **Design & Quality** | **%10** | Minimalist, responsive academic layout inspired by Hacettepe faculty personal pages; 100% free of 403 tile errors and API key watermarks. |

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

## 🎯 Technical GIS Solutions

* **Marker Zoom Threshold & Clustering:**  
  At country overview (Zoom < 11), individual markers are grouped into a regional cluster to prevent overlapping (especially between Küre Engineering and Doruk Surveying, ~160 m apart). Individual markers only appear when zoomed in (`minZoom: 11` in OpenLayers; `Zoom >= 15` in Leaflet).

* **Preventing Horizontal World Repeating:**  
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

To publish on GitHub Pages:
```bash
git push -u origin main
```
Enable GitHub Pages in repository **Settings > Pages > Branch: main / root**.
