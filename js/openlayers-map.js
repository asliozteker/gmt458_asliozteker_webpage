/**
 * OpenLayers Haritası - Staj Deneyimleri (Özgeçmiş & Yetkinlikler Sayfası)
 * Türkiye & Ankara Odaklı İnteraktif Harita
 * 
 * GMT 458 Ödev Kazanımları:
 * - Issue 1 Çözümü: Zoom eşiği (Zoom Threshold) - Türkiye ölçeğinde çakışmayı önlemek için işaretçileri
 *   belirli bir zoom seviyesinden (Zoom >= 11) sonra gösterme veya kümeleme.
 * - Issue 2 Çözümü: Harita uzaklaştırıldığında dünyanın kendini tekrarlamasını engelleme (wrapX: false & View Extent)
 */

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('openlayersMap');
  if (!mapElement) return;

  // Koordinatlar [Boylam (Lon), Enlem (Lat)] - OpenLayers EPSG:4326 -> EPSG:3857
  const TURKEY_CENTER = ol.proj.fromLonLat([35.2433, 38.9637]);
  const ANKARA_CENTER = ol.proj.fromLonLat([32.8541, 39.9208]);

  const internships = [
    {
      id: "karayollari",
      name: "Karayolları 4. Bölge Müdürlüğü",
      role: "Geomatik & CBS Stajyeri",
      desc: "Yol ağı coğrafi bilgi sistemleri, kamulaştırma haritaları, güzergah etüt ve GNSS ölçümleri.",
      coords: ol.proj.fromLonLat([32.85022518021346, 39.9572848124613]),
      lat: 39.957285,
      lon: 32.850225,
      color: "#0284c7",
      icon: "🛣️",
      date: "Temmuz - Ağustos 2024"
    },
    {
      id: "kure",
      name: "Küre Mühendislik",
      role: "Mekânsal Veri & Harita Stajyeri",
      desc: "İmar uygulamaları, halihazır harita üretimi, Sayısal Arazi Modeli (DEM) ve CAD/CBS entegrasyonu.",
      coords: ol.proj.fromLonLat([32.81563373589881, 39.88448294796374]),
      lat: 39.884483,
      lon: 32.815634,
      color: "#10b981",
      icon: "📐",
      date: "Ağustos - Eylül 2025"
    },
    {
      id: "doruk",
      name: "Doruk Harita",
      role: "Mühendislik Ölçmeleri & CBS Stajyeri",
      desc: "Total Station ve GNSS RTK ile altyapı aplikasyonu, deformasyon gözlemleri ve Coğrafi Bilgi Sistemi veri tabanı girişi.",
      coords: ol.proj.fromLonLat([32.817468947570866, 39.88491243424993]),
      lat: 39.884912,
      lon: 32.817469,
      color: "#8b5cf6",
      icon: "🏗️",
      date: "Haziran - Temmuz 2025"
    }
  ];

  // ==========================================================================
  // ISSUE 2 ÇÖZÜMÜ: Earth repeating itself when zoomed out
  // OpenLayers'ta:
  // 1) ol.source.OSM({ wrapX: false }) -> OSM karolarının yatayda sonsuz kopyalanmasını engeller!
  // 2) ol.View extent sınırlaması -> Kullanıcının dünya sınırları ötesine sürüklemesini engeller.
  // ==========================================================================
  const maxExtent = ol.proj.get('EPSG:3857').getExtent();

  const osmSource = new ol.source.OSM({
    wrapX: false // ISSUE 2: Dünyanın tekrar etmesini engeller!
  });

  const baseLayer = new ol.layer.Tile({
    source: osmSource
  });

  // ==========================================================================
  // ISSUE 1 ÇÖZÜMÜ: Zoom Threshold ile işaretçi çakışmasını engelleme
  // Küre Mühendislik ile Doruk Harita birbirine çok yakın (birkaç yüz metre).
  // Türkiye genelinde bakıldığında üst üste binerler.
  // Bu nedenle detay işaretçiler için minZoom eşiği (Zoom >= 11) belirlenmiştir.
  // Zoom < 11 iken ise Türkiye genelinde tek bir özet küme rozeti gösterilir.
  // ==========================================================================
  const ZOOM_THRESHOLD = 11;

  // 1) Bireysel Staj Noktaları Özellikleri (Features)
  const detailFeatures = internships.map(item => {
    const f = new ol.Feature({
      geometry: new ol.geom.Point(item.coords),
      data: item
    });
    return f;
  });

  const detailSource = new ol.source.Vector({
    features: detailFeatures
  });

  // Detay İşaretçi Stili
  const createMarkerStyle = (item) => {
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: 12,
        fill: new ol.style.Fill({ color: item.color }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 3 })
      }),
      text: new ol.style.Text({
        text: item.name,
        font: 'bold 12px Inter, sans-serif',
        offsetY: 22,
        fill: new ol.style.Fill({ color: '#0f172a' }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 3 }),
        backgroundFill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.85)' }),
        padding: [2, 6, 2, 6]
      })
    });
  };

  // Detay Vektör Katmanı (minZoom ayarı ile ISSUE 1 doğrudan çözülür)
  const detailVectorLayer = new ol.layer.Vector({
    source: detailSource,
    minZoom: ZOOM_THRESHOLD, // ISSUE 1 ÇÖZÜMÜ: Zoom seviyesi 11'den küçükse bu katman görünmez!
    style: (feature) => createMarkerStyle(feature.get('data'))
  });

  // 2) Bölgesel Özet Katmanı (Zoom < 11 iken tek bir Ankara staj kümesi gösterir)
  const clusterFeature = new ol.Feature({
    geometry: new ol.geom.Point(ANKARA_CENTER),
    data: {
      name: "Ankara Staj Bölgesi",
      count: "3 Staj Deneyimi",
      desc: "İşaretçilerin çakışmaması için yakınlaşınız (Zoom ≥ 11)."
    }
  });

  const clusterSource = new ol.source.Vector({
    features: [clusterFeature]
  });

  const clusterVectorLayer = new ol.layer.Vector({
    source: clusterSource,
    maxZoom: ZOOM_THRESHOLD, // Zoom 11'e kadar görünür
    style: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 18,
        fill: new ol.style.Fill({ color: '#0284c7' }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 3 })
      }),
      text: new ol.style.Text({
        text: "📍 Ankara (3 Staj)",
        font: 'bold 12px Inter, sans-serif',
        offsetY: 26,
        fill: new ol.style.Fill({ color: '#0284c7' }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 3 }),
        backgroundFill: new ol.style.Fill({ color: '#ffffff' }),
        padding: [3, 8, 3, 8]
      })
    })
  });

  // Harita Görünümü (View)
  const view = new ol.View({
    center: ANKARA_CENTER,
    zoom: 12,
    minZoom: 4,
    maxZoom: 19,
    extent: maxExtent // ISSUE 2 ÇÖZÜMÜ
  });

  // Haritayı Başlat
  const map = new ol.Map({
    target: 'openlayersMap',
    layers: [baseLayer, clusterVectorLayer, detailVectorLayer],
    view: view
  });

  // ==========================================================================
  // POPUP OVERLAY (Tıklama ile Bilgi Gösterimi)
  // ==========================================================================
  const popupContainer = document.getElementById('olPopup');
  const popupCloser = document.getElementById('olPopupCloser');
  const popupContent = document.getElementById('olPopupContent');

  const overlay = new ol.Overlay({
    element: popupContainer,
    autoPan: {
      animation: {
        duration: 250
      }
    }
  });
  map.addOverlay(overlay);

  if (popupCloser) {
    popupCloser.onclick = () => {
      overlay.setPosition(undefined);
      popupCloser.blur();
      return false;
    };
  }

  // Tıklama Olayı (Marker Seçimi)
  map.on('singleclick', (evt) => {
    const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
    if (feature) {
      const data = feature.get('data');
      const coordinates = feature.getGeometry().getCoordinates();

      if (data.role) {
        // Bireysel Staj Detay Popupu
        popupContent.innerHTML = `
          <div style="font-family: inherit; max-width: 280px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 24px;">${data.icon}</span>
              <div>
                <h4 style="margin: 0; font-size: 15px; color: #0f172a; font-weight: 700;">${data.name}</h4>
                <span style="font-size: 12px; color: ${data.color}; font-weight: 600;">${data.role}</span>
              </div>
            </div>
            <p style="margin: 0 0 6px 0; font-size: 12px; color: #475569; line-height: 1.5;">${data.desc}</p>
            <div style="display:flex; justify-content:space-between; font-size:11px; color:#64748b; background:#f1f5f9; padding:4px 6px; border-radius:4px;">
              <span>📅 ${data.date}</span>
              <span>📍 ${data.lat.toFixed(4)}, ${data.lon.toFixed(4)}</span>
            </div>
          </div>
        `;
      } else {
        // Özet Küme Popupu
        popupContent.innerHTML = `
          <div style="font-family: inherit; max-width: 240px;">
            <h4 style="margin: 0 0 4px 0; font-size: 14px; color: #0284c7; font-weight: 700;">${data.name}</h4>
            <p style="margin: 0; font-size: 12px; color: #475569;">${data.desc}</p>
          </div>
        `;
      }

      overlay.setPosition(coordinates);
    } else {
      overlay.setPosition(undefined);
    }
  });

  // İşaretçi Üzerine Gelince İmleci Pointer Yap
  map.on('pointermove', (e) => {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });

  // ==========================================================================
  // ZOOM EŞİĞİ VE BİLGİLENDİRME GÜNCELLEMESİ
  // ==========================================================================
  const olZoomStatus = document.getElementById('olZoomStatus');
  const updateOlZoomStatus = () => {
    const currentZoom = Math.round(view.getZoom());
    if (olZoomStatus) {
      if (currentZoom >= ZOOM_THRESHOLD) {
        olZoomStatus.innerHTML = `
          <span style="color:#10b981; font-weight:700;">● Zoom ${currentZoom} (Eşik Aşıldı: 3 Staj İşaretçisi Ayrı Ayrı Gösteriliyor)</span>
        `;
      } else {
        olZoomStatus.innerHTML = `
          <span style="color:#f59e0b; font-weight:700;">● Zoom ${currentZoom} (Eşik Altı: Çakışmayı önlemek için tek küme gösteriliyor, yakınlaşınız)</span>
        `;
      }
    }
  };

  view.on('change:resolution', updateOlZoomStatus);
  updateOlZoomStatus();

  // Hızlı Gezinme Butonları (Ankara Stajları vs Türkiye Genel Bakış)
  const btnFocusAnkaraIntern = document.getElementById('btnFocusAnkaraIntern');
  if (btnFocusAnkaraIntern) {
    btnFocusAnkaraIntern.addEventListener('click', () => {
      view.animate({
        center: ANKARA_CENTER,
        zoom: 12,
        duration: 1000
      });
    });
  }

  const btnFocusTurkey = document.getElementById('btnFocusTurkey');
  if (btnFocusTurkey) {
    btnFocusTurkey.addEventListener('click', () => {
      view.animate({
        center: TURKEY_CENTER,
        zoom: 6,
        duration: 1000
      });
    });
  }
});
