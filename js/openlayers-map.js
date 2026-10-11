/**
 * OpenLayers Map - Internship Experiences (Resume Page)
 * Turkey and Ankara Focused Interactive Map
 * 
 * Uses reliable CartoDB Voyager and Esri basemaps to prevent 403 Access Blocked errors.
 * GMT 458 Assignment Objectives:
 * - Issue 1 Solution: Zoom threshold (minZoom: 11) to prevent marker overlap at smaller scales
 * - Issue 2 Solution: Prevent earth repeating when zoomed out (wrapX: false & view extent)
 */

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('openlayersMap');
  if (!mapElement) return;

  const TURKEY_CENTER = ol.proj.fromLonLat([35.2433, 38.9637]);
  const ANKARA_CENTER = ol.proj.fromLonLat([32.8350, 39.9200]);

  // Internship Locations - Latitude (Lat) & Longitude (Lon)
  const internships = [
    {
      id: "karayollari",
      name: "General Directorate of Highways (4th Regional Directorate)",
      role: "Geomatics & GIS Intern",
      desc: "Highway network GIS database, expropriation plans, alignment surveys.",
      coords: ol.proj.fromLonLat([32.85022518021346, 39.9572848124613]),
      lat: 39.957285,
      lon: 32.850225,
      date: "July - August 2024",
      color: "#0284c7",
      textOffset: [0, -32]
    },
    {
      id: "kure",
      name: "Küre Engineering",
      role: "Spatial Data Intern",
      desc: "Zoning applications, base mapping, Digital Elevation Model (DEM) creation.",
      coords: ol.proj.fromLonLat([32.81563373589881, 39.88448294796374]),
      lat: 39.884483,
      lon: 32.815634,
      date: "August - September 2025",
      color: "#16a34a",
      textOffset: [-75, -30] // Offset to prevent text overlap with Doruk Surveying
    },
    {
      id: "doruk",
      name: "Doruk Surveying & Engineering",
      role: "Field & Engineering Survey Intern",
      desc: "Total Station and GNSS RTK infrastructure staking, deformation monitoring.",
      coords: ol.proj.fromLonLat([32.817468947570866, 39.88491243424993]),
      lat: 39.884912,
      lon: 32.817469,
      date: "June - July 2025",
      color: "#9333ea",
      textOffset: [75, -30] // Offset to prevent text overlap with Küre Engineering
    }
  ];

  // ==========================================================================
  // BASEMAP LAYERS (NON-BLOCKING CARTO AND ESRI SERVICES)
  // ==========================================================================
  const maxExtent = ol.proj.get('EPSG:3857').getExtent();

  // CartoDB Voyager Basemap (OpenStreetMap data, CORS-friendly, no 403 blocks)
  const cartoVoyagerSource = new ol.source.XYZ({
    url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    attributions: '&copy; OpenStreetMap contributors &copy; CARTO',
    wrapX: false, // ISSUE 2: Prevents horizontal repetition of world tiles
    maxZoom: 19
  });

  const cartoLayer = new ol.layer.Tile({
    source: cartoVoyagerSource,
    visible: true
  });

  // Esri World Imagery (Satellite)
  const esriSatelliteSource = new ol.source.XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attributions: 'Tiles &copy; Esri',
    wrapX: false, // ISSUE 2: Prevents horizontal repetition
    maxZoom: 19
  });

  const satelliteLayer = new ol.layer.Tile({
    source: esriSatelliteSource,
    visible: false
  });

  // ==========================================================================
  // MARKERS AND ISSUE 1: ZOOM THRESHOLD
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

  // Professional Marker Style
  const createMarkerStyle = (item) => {
    return [
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          fill: new ol.style.Fill({ color: item.color }),
          stroke: new ol.style.Stroke({ color: '#ffffff', width: 3 })
        })
      }),
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

  // Detailed Vector Layer (Zoom >= 11 - ISSUE 1 Solution)
  const detailVectorLayer = new ol.layer.Vector({
    source: detailSource,
    minZoom: 11, // ISSUE 1: Hidden when Zoom < 11 to avoid clutters
    style: (feature) => createMarkerStyle(feature.get('data'))
  });

  // Regional Cluster Marker (Visible when Zoom < 11 at country scale)
  const clusterFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([32.835, 39.920])),
    data: {
      name: "Ankara Internship Region",
      role: "3 Internship Sites",
      desc: "Zoom in (Zoom ≥ 11) to view individual internship locations and details."
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
        text: "📍 Ankara (3 Internships - Zoom In)",
        font: 'bold 12px "Open Sans", sans-serif',
        offsetY: 24,
        fill: new ol.style.Fill({ color: '#205493' }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 4 }),
        backgroundFill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.95)' }),
        padding: [3, 8, 3, 8]
      })
    })
  });

  // Map View - ISSUE 2: Extent Constrained
  const view = new ol.View({
    center: ANKARA_CENTER,
    zoom: 12,
    minZoom: 4,
    maxZoom: 19,
    extent: maxExtent // ISSUE 2: Constrains panning outside world boundary
  });

  const map = new ol.Map({
    target: 'openlayersMap',
    layers: [cartoLayer, satelliteLayer, clusterVectorLayer, detailVectorLayer],
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

  // Open Popup on Click
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

  map.on('pointermove', (e) => {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });

  // Toolbar Actions
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

  // Toggle Basemap (Street vs Satellite)
  const btnToggleLayer = document.getElementById('btnToggleOlLayer');
  if (btnToggleLayer) {
    btnToggleLayer.addEventListener('click', () => {
      const isSat = satelliteLayer.getVisible();
      satelliteLayer.setVisible(!isSat);
      cartoLayer.setVisible(isSat);
      btnToggleLayer.textContent = isSat ? "🗺️ Switch to Satellite" : "🗺️ Switch to Street Map";
    });
  }
});
