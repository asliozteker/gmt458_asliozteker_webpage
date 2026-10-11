/**
 * OpenLayers Haritası - Staj Deneyimleri (Özgeçmiş Sayfası)
 * Türkiye ve Ankara Odaklı İnteraktif Harita
 * 
 * GMT 458 Yönerge Kazanımları:
 * - Issue 1 Çözümü: Zoom eşiği (Zoom Threshold) - Türkiye ölçeğinde çakışmayı önleme
 * - Issue 2 Çözümü: Harita uzaklaştırıldığında dünyanın kendini tekrarlamasını engelleme (wrapX: false)
 */

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('openlayersMap');
  if (!mapElement) return;

  const TURKEY_CENTER = ol.proj.fromLonLat([35.2433, 38.9637]);
  const ANKARA_CENTER = ol.proj.fromLonLat([32.8541, 39.9208]);

  const internships = [
    {
      name: "Karayolları 4. Bölge Müdürlüğü",
      role: "Geomatik & CBS Stajı",
      desc: "Yol ağı coğrafi bilgi sistemleri, kamulaştırma ve güzergah etüt ölçümleri.",
      coords: ol.proj.fromLonLat([32.85022518021346, 39.9572848124613]),
      lat: 39.957285,
      lon: 32.850225,
      date: "Temmuz - Ağustos 2024"
    },
    {
      name: "Küre Mühendislik",
      role: "Mekânsal Veri Stajı",
      desc: "İmar uygulamaları, halihazır harita üretimi ve Sayısal Arazi Modeli (DEM).",
      coords: ol.proj.fromLonLat([32.81563373589881, 39.88448294796374]),
      lat: 39.884483,
      lon: 32.815634,
      date: "Ağustos - Eylül 2025"
    },
    {
      name: "Doruk Harita",
      role: "Mühendislik Ölçmeleri Stajı",
      desc: "Total Station ve GNSS RTK ile altyapı aplikasyonu ve deformasyon ölçümleri.",
      coords: ol.proj.fromLonLat([32.817468947570866, 39.88491243424993]),
      lat: 39.884912,
      lon: 32.817469,
      date: "Haziran - Temmuz 2025"
    }
  ];

  // ISSUE 2 ÇÖZÜMÜ: wrapX: false ve View Extent
  const maxExtent = ol.proj.get('EPSG:3857').getExtent();

  const osmSource = new ol.source.OSM({
    wrapX: false // Dünyanın tekrar etmesini engeller
  });

  const baseLayer = new ol.layer.Tile({
    source: osmSource
  });

  // ISSUE 1 ÇÖZÜMÜ: Zoom Threshold (minZoom: 11)
  const detailFeatures = internships.map(item => {
    return new ol.Feature({
      geometry: new ol.geom.Point(item.coords),
      data: item
    });
  });

  const detailSource = new ol.source.Vector({
    features: detailFeatures
  });

  const detailVectorLayer = new ol.layer.Vector({
    source: detailSource,
    minZoom: 11, // ISSUE 1: Zoom < 11 iken detay noktalar çakışmayı önlemek için gizlenir
    style: (feature) => {
      const data = feature.get('data');
      return new ol.style.Style({
        image: new ol.style.Circle({
          radius: 8,
          fill: new ol.style.Fill({ color: '#205493' }),
          stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
        }),
        text: new ol.style.Text({
          text: data.name,
          font: '12px "Open Sans", sans-serif',
          offsetY: 18,
          fill: new ol.style.Fill({ color: '#222222' }),
          stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
        })
      });
    }
  });

  // Zoom < 11 iken tek bir özet gösterge
  const clusterFeature = new ol.Feature({
    geometry: new ol.geom.Point(ANKARA_CENTER),
    data: {
      name: "Ankara Staj Bölgesi",
      role: "3 Staj Noktası",
      desc: "İşaretçileri ayrıntılı görmek için yakınlaşınız (Zoom ≥ 11)."
    }
  });

  const clusterVectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({ features: [clusterFeature] }),
    maxZoom: 11,
    style: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 12,
        fill: new ol.style.Fill({ color: '#205493' }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
      }),
      text: new ol.style.Text({
        text: "Ankara (3 Staj Noktası - Yakınlaşınız)",
        font: '12px "Open Sans", sans-serif',
        offsetY: 20,
        fill: new ol.style.Fill({ color: '#205493' }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
      })
    })
  });

  const view = new ol.View({
    center: ANKARA_CENTER,
    zoom: 12,
    minZoom: 4,
    maxZoom: 19,
    extent: maxExtent
  });

  const map = new ol.Map({
    target: 'openlayersMap',
    layers: [baseLayer, clusterVectorLayer, detailVectorLayer],
    view: view
  });

  // Popup Overlay
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

  map.on('singleclick', (evt) => {
    const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
    if (feature) {
      const data = feature.get('data');
      const coordinates = feature.getGeometry().getCoordinates();
      popupContent.innerHTML = `
        <div style="font-size: 13px; line-height: 1.5;">
          <strong>${data.name}</strong><br>
          <span style="color:#205493; font-weight:600;">${data.role}</span><br>
          <p style="margin: 4px 0; color:#555;">${data.desc}</p>
          ${data.date ? `<small style="color:#777;">📅 ${data.date}</small><br>` : ''}
          ${data.lat ? `<small style="color:#888;">📍 ${data.lat.toFixed(4)}, ${data.lon.toFixed(4)}</small>` : ''}
        </div>
      `;
      overlay.setPosition(coordinates);
    } else {
      overlay.setPosition(undefined);
    }
  });

  map.on('pointermove', (e) => {
    const hit = map.hasFeatureAtPixel(map.getEventPixel(e.originalEvent));
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });

  // Toolbar Butonları
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
});
