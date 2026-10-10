/**
 * Leaflet Haritası - Hacettepe Üniversitesi Geomatik Mühendisliği (Akademik Yaşam)
 * Ankara Odaklı İnteraktif Harita
 * 
 * GMT 458 Ödev Kazanımları:
 * - Issue 1 Çözümü: Zoom eşiği (Zoom Threshold) ile işaretçi çakışmasını engelleme
 * - Issue 2 Çözümü: Harita uzaklaştırıldığında dünyanın kendini tekrarlamasını engelleme (noWrap & maxBounds)
 */

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('leafletMap');
  if (!mapElement) return;

  // Koordinatlar: Hacettepe Üniversitesi Geomatik (Harita) Mühendisliği Bölümü
  const GEOMATIK_COORDS = [39.86574196299712, 32.733949892817506];
  const ANKARA_CENTER = [39.92077, 32.85411];

  // ==========================================================================
  // ISSUE 2 ÇÖZÜMÜ: Earth repeating itself when zoomed out
  // 1) noWrap: true (karonun yatayda kopyalanmasını önler)
  // 2) maxBounds & maxBoundsViscosity (kullanıcının dünya dışına kaymasını kilitler)
  // 3) minZoom: 2.5 (aşırı uzaklaşmayı engeller)
  // ==========================================================================
  const worldBounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    noWrap: true, // ISSUE 2: Dünyanın yatayda kendini tekrarlamasını engeller!
    bounds: worldBounds
  });

  const cartoPositron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB &copy; OpenStreetMap',
    noWrap: true,
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
    maxBounds: worldBounds,           // ISSUE 2: Dünya dışına kaydırmayı engeller
    maxBoundsViscosity: 1.0,          // ISSUE 2: Yumuşak esneme yerine tam kilit
    layers: [osmLayer]
  });

  // Katman Kontrolü (Base Layers)
  const baseLayers = {
    "OpenStreetMap (Standart)": osmLayer,
    "Carto Light (Sade GIS)": cartoPositron,
    "Esri Uydu Görüntüsü": esriSatellite
  };
  L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);

  // Ölçek Çubuğu
  L.control.scale({ imperial: false, metric: true, position: 'bottomright' }).addTo(map);

  // Özel İkon Tasarımı (Hacettepe Üniversitesi Geomatik Bölümü)
  const geomatikIcon = L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, #0284c7, #075985);
        color: white;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 4px 14px rgba(2, 132, 199, 0.5);
        border: 3px solid #ffffff;
      ">
        🛰️
      </div>
      <div style="
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid #075985;
      "></div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 50],
    popupAnchor: [0, -50]
  });

  // Ana İşaretçi: Hacettepe Üniversitesi Geomatik Mühendisliği
  const mainMarker = L.marker(GEOMATIK_COORDS, { icon: geomatikIcon }).addTo(map);
  mainMarker.bindPopup(`
    <div style="font-family: inherit; padding: 4px; max-width: 260px;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
        <span style="font-size: 24px;">🏛️</span>
        <div>
          <h4 style="margin:0; font-size:15px; color:#0f172a; font-weight:700;">Hacettepe Üniversitesi</h4>
          <span style="font-size:12px; color:#0284c7; font-weight:600;">Geomatik Mühendisliği Bölümü</span>
        </div>
      </div>
      <p style="margin:0 0 8px 0; font-size:12px; color:#475569; line-height:1.5;">
        Beytepe Kampüsü'nde yer alan bölümümüzde Web GIS, Fotogrametri, Jeodezi, GNSS ve Uzaktan Algılama alanlarında akademik öğrenimime devam etmekteyim.
      </p>
      <div style="font-size:11px; color:#64748b; background:#f1f5f9; padding:5px 8px; border-radius:4px; font-family:monospace;">
        📍 39.865742° K, 32.733950° D
      </div>
    </div>
  `).openPopup();

  // ==========================================================================
  // ISSUE 1 ÇÖZÜMÜ: When there are many markers on the map, they may overlap.
  // Zoom Threshold (Eşik Değeri) Uygulaması:
  // Kampüs içi detay alt laboratuvarlar yalnızca kullanıcı yeterince yakınlaştığında (zoom >= 15) görünür!
  // ==========================================================================
  const subLocations = [
    {
      name: "Fotogrametri ve CBS Laboratuvarı",
      coords: [39.86535, 32.73450],
      icon: "💻",
      desc: "Web GIS ve Mekânsal Veri Analizi derslerinin yürütüldüğü bilgisayar laboratuvarı."
    },
    {
      name: "Jeodezi & GNSS Gözlem Noktası",
      coords: [39.86620, 32.73310],
      icon: "📡",
      desc: "Uydu bazlı konum belirleme ve GNSS kalibrasyon çalışma istasyonu."
    },
    {
      name: "Uzaktan Algılama ve İHA Birimi",
      coords: [39.86660, 32.73480],
      icon: "🚁",
      desc: "İnsansız hava araçları ve multispektral uydu görüntüsü işleme çalışma alanı."
    }
  ];

  const subMarkersGroup = L.layerGroup();
  const ZOOM_THRESHOLD = 15; // Belirlenen zoom eşiği

  subLocations.forEach(loc => {
    const subIcon = L.divIcon({
      className: 'sub-marker',
      html: `
        <div style="
          background: #ffffff;
          color: #0f172a;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border: 2px solid #0284c7;
        ">${loc.icon}</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker(loc.coords, { icon: subIcon });
    marker.bindPopup(`
      <div style="font-size:12px; max-width:200px;">
        <strong>${loc.name}</strong><br>
        <span style="color:#64748b;">${loc.desc}</span>
      </div>
    `);
    subMarkersGroup.addLayer(marker);
  });

  // Durum Bildirimini Güncelleme Fonksiyonu
  const zoomStatusText = document.getElementById('leafletZoomStatus');
  const updateZoomStatus = () => {
    const currentZoom = map.getZoom();
    const isVisible = currentZoom >= ZOOM_THRESHOLD;

    if (isVisible) {
      if (!map.hasLayer(subMarkersGroup)) {
        map.addLayer(subMarkersGroup);
      }
      if (zoomStatusText) {
        zoomStatusText.innerHTML = `
          <span style="color:#10b981; font-weight:700;">● Zoom ${currentZoom} (Eşik Aşıldı: Alt İşaretçiler Aktif)</span>
        `;
      }
    } else {
      if (map.hasLayer(subMarkersGroup)) {
        map.removeLayer(subMarkersGroup);
      }
      if (zoomStatusText) {
        zoomStatusText.innerHTML = `
          <span style="color:#f59e0b; font-weight:700;">● Zoom ${currentZoom} (Eşik Altı: Çakışmayı önlemek için alt işaretçiler gizlendi)</span>
        `;
      }
    }
  };

  // Harita her zoomlandığında kontrol et
  map.on('zoomend', updateZoomStatus);
  updateZoomStatus(); // İlk yüklemede çalıştır

  // Hızlı Buton Etkileşimleri
  const btnFocusGeomatik = document.getElementById('btnFocusGeomatik');
  if (btnFocusGeomatik) {
    btnFocusGeomatik.addEventListener('click', () => {
      map.flyTo(GEOMATIK_COORDS, 16, { duration: 1.2 });
      mainMarker.openPopup();
    });
  }

  const btnFocusAnkara = document.getElementById('btnFocusAnkara');
  if (btnFocusAnkara) {
    btnFocusAnkara.addEventListener('click', () => {
      map.flyTo(ANKARA_CENTER, 11, { duration: 1.2 });
    });
  }
});
