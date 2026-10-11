/**
 * OpenLayers Haritası - Staj Deneyimleri (Özgeçmiş Sayfası)
 * Türkiye ve Ankara Odaklı İnteraktif Harita
 * 
 * 403 Access Blocked hatasını önlemek için güvenilir CartoDB Voyager ve Esri altlıkları kullanılmıştır.
 * GMT 458 Yönerge Kazanımları:
 * - Issue 1 Çözümü: Zoom eşiği (Zoom Threshold) - Uzak ölçekte çakışmayı önleme
 * - Issue 2 Çözümü: Harita uzaklaştırıldığında dünyanın kendini tekrarlamasını engelleme (wrapX: false)
 */

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('openlayersMap');
  if (!mapElement) return;

  const TURKEY_CENTER = ol.proj.fromLonLat([35.2433, 38.9637]);
  const ANKARA_CENTER = ol.proj.fromLonLat([32.8350, 39.9200]);

  // Staj Konumları - Enlem (Lat) ve Boylam (Lon)
  const internships = [
    {
      id: "karayollari",
      name: "Karayolları 4. Bölge Müdürlüğü",
      role: "Geomatik & CBS Stajı",
      desc: "Yol ağı coğrafi bilgi sistemleri, kamulaştırma ve güzergah etüt ölçümleri.",
      coords: ol.proj.fromLonLat([32.85022518021346, 39.9572848124613]),
      lat: 39.957285,
      lon: 32.850225,
      date: "Temmuz - Ağustos 2024",
      color: "#0284c7",
      textOffset: [0, -32]
    },
    {
      id: "kure",
      name: "Küre Mühendislik",
      role: "Mekânsal Veri Stajı",
      desc: "İmar uygulamaları, halihazır harita üretimi ve Sayısal Arazi Modeli (DEM).",
      coords: ol.proj.fromLonLat([32.81563373589881, 39.88448294796374]),
      lat: 39.884483,
      lon: 32.815634,
      date: "Ağustos - Eylül 2025",
      color: "#16a34a",
      textOffset: [-65, -30] // Doruk Harita ile metin çakışmasını önlemek için sol üst ofset
    },
    {
      id: "doruk",
      name: "Doruk Harita",
      role: "Mühendislik Ölçmeleri Stajı",
      desc: "Total Station ve GNSS RTK ile altyapı aplikasyonu ve deformasyon ölçümleri.",
      coords: ol.proj.fromLonLat([32.817468947570866, 39.88491243424993]),
      lat: 39.884912,
      lon: 32.817469,
      date: "Haziran - Temmuz 2025",
      color: "#9333ea",
      textOffset: [65, -30] // Küre Mühendislik ile metin çakışmasını önlemek için sağ üst ofset
    }
  ];

  // ==========================================================================
  // ALTLIK HARİTA KATMANLARI (403 ENGELİNİ AŞAN GÜVENİLİR VE SERBEST SERVİSLER)
  // 1) CartoDB Voyager: Detaylı sokak ve yerleşim haritası (OSM verisi, engelsiz)
  // 2) Esri World Imagery: Yüksek çözünürlüklü uydu görüntüsü
  // ==========================================================================
  const maxExtent = ol.proj.get('EPSG:3857').getExtent();

  // CartoDB Voyager Altlığı (403 Hatası Vermeyen Kesintisiz OSM Altlığı)
  const cartoVoyagerSource = new ol.source.XYZ({
    url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    attributions: '&copy; OpenStreetMap &copy; CARTO',
    wrapX: false, // ISSUE 2: Dünyanın yatayda kendini tekrarlamasını engeller!
    maxZoom: 19
  });

  const cartoLayer = new ol.layer.Tile({
    source: cartoVoyagerSource,
    visible: true
  });

  // Esri Uydu Görüntüsü Altlığı
  const esriSatelliteSource = new ol.source.XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attributions: 'Tiles &copy; Esri',
    wrapX: false, // ISSUE 2: Dünyanın yatay tekrarını engeller!
    maxZoom: 19
  });

  const satelliteLayer = new ol.layer.Tile({
    source: esriSatelliteSource,
    visible: false
  });

  // ==========================================================================
  // İŞARETÇİLER VE ISSUE 1: ZOOM THRESHOLD
  // ==========================================================================
  const detailFeatures = internships.map(item => {
    return new ol.Feature({
      geometry: new ol.geom.Point(item.coords),
      data: item
    });
  });

  const detailSource = new ol.source.Vector({
    features: detailFeatures
  });

  // Profesyonel Pin İşaretçi Stili
  const createMarkerStyle = (item) => {
    return [
      // Dış Halka & Gölge
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          fill: new ol.style.Fill({ color: item.color }),
          stroke: new ol.style.Stroke({ color: '#ffffff', width: 3 })
        })
      }),
      // Nokta İçi Merkez
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({ color: '#ffffff' })
        }),
        text: new ol.style.Text({
          text: item.name,
          font: 'bold 12px "Open Sans", -apple-system, sans-serif',
          offsetX: item.textOffset[0],
          offsetY: item.textOffset[1],
          fill: new ol.style.Fill({ color: '#111827' }),
          stroke: new ol.style.Stroke({ color: '#ffffff', width: 4 }),
          backgroundFill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.92)' }),
          backgroundStroke: new ol.style.Stroke({ color: '#d1d5db', width: 1 }),
          padding: [3, 6, 3, 6]
        })
      })
    ];
  };

  // Detay Vektör Katmanı (Zoom >= 11 iken görünür - ISSUE 1 Çözümü)
  const detailVectorLayer = new ol.layer.Vector({
    source: detailSource,
    minZoom: 11, // ISSUE 1: Zoom < 11 iken çakışmayı önlemek için gizlenir
    style: (feature) => createMarkerStyle(feature.get('data'))
  });

  // Özet Bölge Katmanı (Zoom < 11 iken tek bir Ankara staj kümesi gösterir)
  const clusterFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([32.835, 39.920])),
    data: {
      name: "Ankara Staj Bölgesi",
      role: "3 Staj Noktası",
      desc: "İşaretçileri detaylı incelemek için haritaya yakınlaşınız (Zoom ≥ 11)."
    }
  });

  const clusterVectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({ features: [clusterFeature] }),
    maxZoom: 11,
    style: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 14,
        fill: new ol.style.Fill({ color: '#205493' }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 3 })
      }),
      text: new ol.style.Text({
        text: "📍 Ankara (3 Staj Noktası - Yakınlaşınız)",
        font: 'bold 12px "Open Sans", sans-serif',
        offsetY: 24,
        fill: new ol.style.Fill({ color: '#205493' }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 4 }),
        backgroundFill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.95)' }),
        padding: [3, 8, 3, 8]
      })
    })
  });

  // Harita Görünümü (View) - ISSUE 2: Extent Kısıtlaması
  const view = new ol.View({
    center: ANKARA_CENTER,
    zoom: 12,
    minZoom: 4,
    maxZoom: 19,
    extent: maxExtent // ISSUE 2: Kullanıcının dünya sınırları ötesine kaymasını engeller
  });

  const map = new ol.Map({
    target: 'openlayersMap',
    layers: [cartoLayer, satelliteLayer, clusterVectorLayer, detailVectorLayer],
    view: view
  });

  // ==========================================================================
  // POPUP BİLGİ PENCERESİ (OVERLAY)
  // ==========================================================================
  const popupContainer = document.getElementById('olPopup');
  const popupCloser = document.getElementById('olPopupCloser');
  const popupContent = document.getElementById('olPopupContent');

  const overlay = new ol.Overlay({
    element: popupContainer,
    autoPan: { animation: { duration: 250 } }
  });
  map.addOverlay(overlay);

  if (popupCloser) {
    popupCloser.onclick = () => {
      overlay.setPosition(undefined);
      popupCloser.blur();
      return false;
    };
  }

  // Tıklama ile Bilgi Açma
  map.on('singleclick', (evt) => {
    const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
    if (feature) {
      const data = feature.get('data');
      const coordinates = feature.getGeometry().getCoordinates();

      popupContent.innerHTML = `
        <div style="font-family: inherit; font-size: 13px; line-height: 1.55; max-width: 260px;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px; color: #111827; font-weight: 700;">${data.name}</h4>
          <span style="display:inline-block; margin-bottom: 6px; color: ${data.color || '#205493'}; font-weight: 600; font-size: 12px;">
            ${data.role}
          </span>
          <p style="margin: 0 0 6px 0; color: #4b5563; font-size: 12px;">${data.desc}</p>
          ${data.date ? `<div style="font-size: 11px; color: #6b7280; margin-bottom: 2px;">📅 ${data.date}</div>` : ''}
          ${data.lat ? `<div style="font-size: 11px; color: #6b7280; background: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-family: monospace;">📍 ${data.lat.toFixed(6)}, ${data.lon.toFixed(6)}</div>` : ''}
        </div>
      `;
      overlay.setPosition(coordinates);
    } else {
      overlay.setPosition(undefined);
    }
  });

  // İşaretçi Üzerinde İmleç Değişimi
  map.on('pointermove', (e) => {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });

  // ==========================================================================
  // HARİTA KONTROL BUTONLARI & KATMAN DEĞİŞTİRME
  // ==========================================================================
  const btnFocusAnkaraIntern = document.getElementById('btnFocusAnkaraIntern');
  if (btnFocusAnkaraIntern) {
    btnFocusAnkaraIntern.addEventListener('click', () => {
      view.animate({ center: ANKARA_CENTER, zoom: 12, duration: 800 });
    });
  }

  const btnFocusTurkey = document.getElementById('btnFocusTurkey');
  if (btnFocusTurkey) {
    btnFocusTurkey.addEventListener('click', () => {
      view.animate({ center: TURKEY_CENTER, zoom: 6, duration: 800 });
    });
  }

  // Altlık Katman Seçimi (Standart Harita vs Uydu)
  const btnToggleLayer = document.getElementById('btnToggleOlLayer');
  if (btnToggleLayer) {
    btnToggleLayer.addEventListener('click', () => {
      const isSat = satelliteLayer.getVisible();
      satelliteLayer.setVisible(!isSat);
      cartoLayer.setVisible(isSat);
      btnToggleLayer.textContent = isSat ? "🗺️ Uydu Görüntüsüne Geç" : "🗺️ Standart Haritaya Geç";
    });
  }
});
