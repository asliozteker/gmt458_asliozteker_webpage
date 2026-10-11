/**
 * Leaflet Haritası - Hacettepe Üniversitesi Geomatik Mühendisliği
 * Akademik Yaşam & Ankara Odaklı Harita
 * 
 * GMT 458 Yönerge Kazanımları:
 * - Issue 1 Çözümü: Zoom eşiği (Zoom Threshold) ile alt işaretçilerin yönetimi
 * - Issue 2 Çözümü: Harita uzaklaştırıldığında dünyanın kendini tekrarlamasını engelleme (noWrap & maxBounds)
 */

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('leafletMap');
  if (!mapElement) return;

  // Hacettepe Üniversitesi Geomatik Mühendisliği Bölümü Koordinatları
  const GEOMATIK_COORDS = [39.86574196299712, 32.733949892817506];
  const ANKARA_CENTER = [39.92077, 32.85411];

  // ISSUE 2 ÇÖZÜMÜ: Earth repeating itself when zoomed out
  const worldBounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    noWrap: true, // Dünyanın yatay tekrarını engeller
    bounds: worldBounds
  });

  const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    noWrap: true,
    bounds: worldBounds
  });

  const map = L.map('leafletMap', {
    center: GEOMATIK_COORDS,
    zoom: 16,
    minZoom: 3,
    maxZoom: 19,
    maxBounds: worldBounds,
    maxBoundsViscosity: 1.0,
    layers: [osmLayer]
  });

  // Sade Katman Seçici
  const baseLayers = {
    "Standart Harita": osmLayer,
    "Uydu Görüntüsü": esriSatellite
  };
  L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);
  L.control.scale({ imperial: false, metric: true, position: 'bottomright' }).addTo(map);

  // Ana İşaretçi: Hacettepe Geomatik Bölümü
  const mainMarker = L.marker(GEOMATIK_COORDS).addTo(map);
  mainMarker.bindPopup(`
    <div style="font-family: inherit; font-size: 13px; line-height: 1.5;">
      <strong>Hacettepe Üniversitesi</strong><br>
      <span>Geomatik (Harita) Mühendisliği Bölümü</span><br>
      <small style="color: #666;">Beytepe Kampüsü, Ankara</small><br>
      <small style="color: #888;">39.8657° K, 32.7339° D</small>
    </div>
  `).openPopup();

  // ISSUE 1 ÇÖZÜMÜ: Marker Zoom Threshold
  // Kampüs alt birimleri yalnızca Zoom >= 15 iken görünür
  const subLocations = [
    { name: "Fotogrametri ve CBS Lab", coords: [39.86535, 32.73450] },
    { name: "Jeodezi & GNSS Gözlem Noktası", coords: [39.86620, 32.73310] },
    { name: "Uzaktan Algılama Laboratuvarı", coords: [39.86660, 32.73480] }
  ];

  const subGroup = L.layerGroup();
  subLocations.forEach(loc => {
    const marker = L.circleMarker(loc.coords, {
      radius: 6,
      fillColor: '#205493',
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9
    }).bindPopup(`<strong>${loc.name}</strong>`);
    subGroup.addLayer(marker);
  });

  const zoomTextElement = document.getElementById('leafletZoomText');
  const updateZoomThreshold = () => {
    const currentZoom = map.getZoom();
    if (currentZoom >= 15) {
      if (!map.hasLayer(subGroup)) map.addLayer(subGroup);
      if (zoomTextElement) zoomTextElement.textContent = `Zoom: ${currentZoom} (Eşik aşıldı, alt noktalar aktif)`;
    } else {
      if (map.hasLayer(subGroup)) map.removeLayer(subGroup);
      if (zoomTextElement) zoomTextElement.textContent = `Zoom: ${currentZoom} (Eşik altı, alt noktalar gizli)`;
    }
  };

  map.on('zoomend', updateZoomThreshold);
  updateZoomThreshold();

  // Toolbar Butonları
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
