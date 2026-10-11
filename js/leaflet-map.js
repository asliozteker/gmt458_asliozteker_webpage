/**
 * Leaflet Map - Hacettepe University Department of Geomatics Engineering
 * Academic Life & Ankara Focused Map
 * 
 * Basemaps use 100% free, non-watermarked, reliable Esri Street and Satellite layers (No API key required, No 403).
 * GMT 458 Objectives:
 * - Issue 1 Solution: Marker zoom threshold for sub-facilities (Zoom >= 15)
 * - Issue 2 Solution: Prevent earth repeating when zoomed out (noWrap: true & maxBounds)
 */

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('leafletMap');
  if (!mapElement) return;

  // Hacettepe University Department of Geomatics Engineering Coordinates
  const GEOMATIK_COORDS = [39.86574196299712, 32.733949892817506];
  const ANKARA_CENTER = [39.92077, 32.85411];

  // ISSUE 2 SOLUTION: Earth repeating itself when zoomed out
  const worldBounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

  // Esri World Street Map (Free, no watermark, no API key needed, high reliability)
  const esriStreet = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    noWrap: true, // ISSUE 2: Prevents world repetition
    bounds: worldBounds,
    maxZoom: 19
  });

  // Esri World Topographic Map
  const esriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    noWrap: true,
    bounds: worldBounds,
    maxZoom: 19
  });

  // Esri World Imagery (Satellite)
  const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    noWrap: true,
    bounds: worldBounds,
    maxZoom: 19
  });

  const map = L.map('leafletMap', {
    center: GEOMATIK_COORDS,
    zoom: 16,
    minZoom: 3,
    maxZoom: 19,
    maxBounds: worldBounds,
    maxBoundsViscosity: 1.0,
    layers: [esriStreet]
  });

  // Layer Switcher
  const baseLayers = {
    "Esri Street Map": esriStreet,
    "Esri Topographic Map": esriTopo,
    "Esri Satellite Imagery": esriSatellite
  };
  L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);
  L.control.scale({ imperial: false, metric: true, position: 'bottomright' }).addTo(map);

  // Custom Vector Pin for Hacettepe Geomatics Engineering
  const customPinIcon = L.divIcon({
    className: 'custom-pin-wrap',
    html: `
      <div style="
        background: #b91c1c;
        color: white;
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 3px 8px rgba(0,0,0,0.35);
      ">
        <span style="transform: rotate(45deg); font-size: 16px;">🏛️</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34]
  });

  const mainMarker = L.marker(GEOMATIK_COORDS, { icon: customPinIcon }).addTo(map);
  mainMarker.bindPopup(`
    <div style="font-family: inherit; font-size: 13px; line-height: 1.55; min-width: 220px; padding: 2px;">
      <h4 style="margin: 0 0 4px 0; color: #b91c1c; font-size: 14px; font-weight: 700;">Hacettepe University</h4>
      <strong>Department of Geomatics Engineering</strong><br>
      <span style="color: #4b5563;">Beytepe Campus, Çankaya, Ankara</span><br>
      <div style="margin-top: 6px; font-size: 11px; background: #f3f4f6; color: #374151; padding: 4px 6px; border-radius: 4px; font-family: monospace;">
        📍 39.865742° N, 32.733950° E
      </div>
    </div>
  `).openPopup();

  // ISSUE 1 SOLUTION: Marker Zoom Threshold (Zoom >= 15)
  const subLocations = [
    { name: "Photogrammetry & GIS Laboratory", coords: [39.86535, 32.73450], icon: "💻" },
    { name: "Geodesy & GNSS Observation Station", coords: [39.86620, 32.73310], icon: "📡" },
    { name: "Remote Sensing Research Facility", coords: [39.86660, 32.73480], icon: "🛰️" }
  ];

  const subGroup = L.layerGroup();
  subLocations.forEach(loc => {
    const subIcon = L.divIcon({
      className: 'sub-pin',
      html: `
        <div style="
          background: #205493;
          color: white;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 5px rgba(0,0,0,0.25);
        ">${loc.icon}</div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    const marker = L.marker(loc.coords, { icon: subIcon });
    marker.bindPopup(`<strong>${loc.name}</strong>`);
    subGroup.addLayer(marker);
  });

  const zoomTextElement = document.getElementById('leafletZoomText');
  const updateZoomThreshold = () => {
    const currentZoom = map.getZoom();
    if (currentZoom >= 15) {
      if (!map.hasLayer(subGroup)) map.addLayer(subGroup);
      if (zoomTextElement) zoomTextElement.textContent = `Zoom: ${currentZoom} (Threshold met: Sub-laboratories visible)`;
    } else {
      if (map.hasLayer(subGroup)) map.removeLayer(subGroup);
      if (zoomTextElement) zoomTextElement.textContent = `Zoom: ${currentZoom} (Below threshold: Sub-markers hidden to avoid clutter)`;
    }
  };

  map.on('zoomend', updateZoomThreshold);
  updateZoomThreshold();

  // Toolbar Actions
  const btnFocusGeomatik = document.getElementById('btnFocusGeomatik');
  if (btnFocusGeomatik) {
    btnFocusGeomatik.addEventListener('click', () => {
      map.flyTo(GEOMATIK_COORDS, 16, { duration: 1 });
      mainMarker.openPopup();
    });
  }

  const btnFocusAnkara = document.getElementById('btnFocusAnkara');
  if (btnFocusAnkara) {
    btnFocusAnkara.addEventListener('click', () => {
      map.flyTo(ANKARA_CENTER, 11, { duration: 1 });
    });
  }
});
