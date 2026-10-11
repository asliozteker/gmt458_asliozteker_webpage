/**
 * Leaflet Haritası - Hacettepe Üniversitesi Geomatik Mühendisliği
 * Akademik Yaşam & Ankara Odaklı Harita
 * 
 * 403 Access Blocked hatasını önlemek için CartoDB Voyager ve Esri altlıkları kullanılmıştır.
 * GMT 458 Yönerge Kazanımları:
 * - Issue 1 Çözümü: Zoom eşiği (Zoom Threshold) ile alt laboratuvar işaretçilerinin yönetimi
 * - Issue 2 Çözümü: Harita uzaklaştırıldığında dünyanın kendini tekrarlamasını engelleme (noWrap & maxBounds)
 */

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('leafletMap');
  if (!mapElement) return;

  // Hacettepe Üniversitesi Geomatik (Harita) Mühendisliği Bölümü Koordinatları
  const GEOMATIK_COORDS = [39.86574196299712, 32.733949892817506];
  const ANKARA_CENTER = [39.92077, 32.85411];

  // ==========================================================================
  // ISSUE 2 ÇÖZÜMÜ: Earth repeating itself when zoomed out
  // noWrap: true ve maxBounds ile dünyanın yatay kopyalanması engellenir
  // ==========================================================================
  const worldBounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

  // 403 Hatası Vermeyen Güvenilir Altlıklar (CartoDB Voyager & Esri)
  const cartoVoyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    noWrap: true, // ISSUE 2: Dünyanın tekrar etmesini engeller!
    bounds: worldBounds,
    maxZoom: 19
  });

  const esriStreet = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    noWrap: true,
    bounds: worldBounds,
    maxZoom: 19
  });

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
    layers: [cartoVoyager]
  });

  // Katman Seçici (Layer Switcher)
  const baseLayers = {
    "Sokak Haritası (Carto Voyager)": cartoVoyager,
    "Esri Sokak Haritası": esriStreet,
    "Esri Uydu Görüntüsü": esriSatellite
  };
  L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);
  L.control.scale({ imperial: false, metric: true, position: 'bottomright' }).addTo(map);

  // ==========================================================================
  // ÖZEL PİN İŞARETÇİSİ (HACETTEPE GEOMATİK MÜHENDİSLİĞİ)
  // CDN görsel kırılmalarını önleyen şık vektörel Leaflet DivIcon
  // ==========================================================================
  const customPinIcon = L.divIcon({
    className: 'custom-pin-wrap',
    html: `
      <div style="
        background: #b91c1c;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      ">
        <span style="transform: rotate(45deg); font-size: 15px;">🏛️</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const mainMarker = L.marker(GEOMATIK_COORDS, { icon: customPinIcon }).addTo(map);
  mainMarker.bindPopup(`
    <div style="font-family: inherit; font-size: 13px; line-height: 1.5; min-width: 200px;">
      <h4 style="margin: 0 0 4px 0; color: #b91c1c; font-size: 14px;">Hacettepe Üniversitesi</h4>
      <strong>Geomatik (Harita) Mühendisliği Bölümü</strong><br>
      <span style="color: #555;">Beytepe Kampüsü, Çankaya, Ankara</span><br>
      <div style="margin-top: 6px; font-size: 11px; background: #f3f4f6; padding: 3px 6px; border-radius: 3px; font-family: monospace;">
        📍 39.865742° K, 32.733950° D
      </div>
    </div>
  `).openPopup();

  // ==========================================================================
  // ISSUE 1 ÇÖZÜMÜ: Marker Zoom Threshold
  // Kampüs alt birimleri yalnızca Zoom >= 15 iken görünür
  // ==========================================================================
  const subLocations = [
    { name: "Fotogrametri ve CBS Laboratuvarı", coords: [39.86535, 32.73450], icon: "💻" },
    { name: "Jeodezi & GNSS Gözlem İstasyonu", coords: [39.86620, 32.73310], icon: "📡" },
    { name: "Uzaktan Algılama Araştırma Birimi", coords: [39.86660, 32.73480], icon: "🛰️" }
  ];

  const subGroup = L.layerGroup();
  subLocations.forEach(loc => {
    const subIcon = L.divIcon({
      className: 'sub-pin',
      html: `
        <div style="
          background: #205493;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 5px rgba(0,0,0,0.25);
        ">${loc.icon}</div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
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
      if (zoomTextElement) zoomTextElement.textContent = `Zoom: ${currentZoom} (Eşik aşıldı: Alt laboratuvarlar aktif)`;
    } else {
      if (map.hasLayer(subGroup)) map.removeLayer(subGroup);
      if (zoomTextElement) zoomTextElement.textContent = `Zoom: ${currentZoom} (Eşik altı: Çakışmayı önlemek için alt noktalar gizli)`;
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
