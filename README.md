# GMT 458 – Web GIS | Assignment 1: Personal Web Page

**Öğrenci Portfolyo Web Sayfası ve Web GIS Uygulaması**  
**Hacettepe Üniversitesi Mühendislik Fakültesi Geomatik (Harita) Mühendisliği Bölümü**

---

## 📌 Proje Genel Bakışı (Project Overview)

Bu web sitesi, **GMT 458 - Web GIS** dersi kapsamında Hacettepe Üniversitesi akademik kişisel web sayfası standartları (örnek: `https://yunus.hacettepe.edu.tr/~banbar/`) referans alınarak sade, dikkat dağıtmayan, temiz ve profesyonel bir yapıda tasarlanmıştır.

Sitede açık kaynaklı harita motorları (**Leaflet** ve **OpenLayers**), CSS animasyonları, resimli ders ve staj tabloları, sabit (sticky) gezinme çubuğu ve ödev yönergesinde istenen teknik çözümler yer almaktadır.

---

## 🗺️ Canlı Haritalar ve Konumlar (Live Maps & Locations)

### 1. Leaflet Haritası – Akademik Yaşamım (`index.html`)
* **Harita Motoru:** Leaflet v1.9.4
* **Kapsam:** Ankara / Beytepe Kampüsü
* **İşaretli Konum:** Hacettepe Üniversitesi Geomatik (Harita) Mühendisliği Bölümü
* **Koordinatlar:** `39.86574196299712, 32.733949892817506` (WGS84)
* **Özellikler:** Katman seçici (Standart Harita / Uydu Görüntüsü), bölüm bilgi penceresi ve odaklanma butonları.

### 2. OpenLayers Haritası – Staj Deneyimleri (`resume.html`)
* **Harita Motoru:** OpenLayers v8.2
* **Kapsam:** Türkiye ve Ankara staj noktaları odak görünümü
* **Projeksiyon:** EPSG:3857 (Web Mercator), kaynak EPSG:4326
* **İşaretli Staj Noktaları:**
  1. **Karayolları 4. Bölge Müdürlüğü:** `39.9572848124613, 32.85022518021346`
  2. **Küre Mühendislik:** `39.88448294796374, 32.81563373589881`
  3. **Doruk Harita:** `39.88491243424993, 32.817468947570866`
* **Özellikler:** İnteraktif bilgi penceresi (Popup Overlay), staj detayları ve dinamik odaklanma.

---

## 🎯 Ödev Yönergesindeki İki Sorunun Çözümü (Solutions to the Two Issues)

### ⚡ Issue 1: Zoom Threshold (İşaretçi Çakışmasını Engelleme) (%10)
* **Problem:** Küre Mühendislik ile Doruk Harita arasındaki mesafe yaklaşık 160 metredir. Haritada uzak ölçekte (Türkiye genel bakışında) bu iki işaretçi üst üste binerek okunaksız hale gelir.
* **OpenLayers Çözümü (`js/openlayers-map.js`):**
  Detay staj işaretçilerini barındıran katmana `minZoom: 11` eşik değeri tanımlanmıştır. Zoom < 11 iken tek bir özet gösterge yer alır; kullanıcı yakınlaştığında (Zoom ≥ 11) bireysel 3 staj noktası açılır.
* **Leaflet Çözümü (`js/leaflet-map.js`):**
  Kampüs içi detay laboratuvarlar yalnızca `map.getZoom() >= 15` olduğunda eklenir; uzak bakışta yalnızca ana bölüm binası görünür.

### 🌍 Issue 2: Earth Repeating Itself When Zoomed Out (Dünyanın Tekrarlanması) (%10)
* **Problem:** Web haritalarında dünya yatay eksende (-180° / +180° ötesinde) sonsuz tekrarlanır.
* **OpenLayers Çözümü (`js/openlayers-map.js`):**
  `new ol.source.OSM({ wrapX: false })` parametresi ve `view.extent` sınırlaması kullanılarak dünyanın yatayda kopyalanması tamamen engellenmiştir.
* **Leaflet Çözümü (`js/leaflet-map.js`):**
  `L.tileLayer` içinde `noWrap: true` ve `bounds` tanımlanmış; harita üzerinde `maxBounds` ve `maxBoundsViscosity: 1.0` ile sert sınır uygulanmıştır.

---

## 📂 Sayfa Mimarisi (4 HTML Sayfası) (%15)

1. `index.html` – **Anasayfa:** Sade profil alanı, kullanıcı için ayrılmış özgeçmiş metin alanı ve Leaflet Ankara Hacettepe haritası.
2. `resume.html` – **Özgeçmiş & Yetkinlikler:** OpenLayers staj haritası, resimli staj tablosu ve yetkinlikler listesi.
3. `courses.html` – **Geçmiş ve Aktif Dersler:** Aktif dönem ve tamamlanan derslerin resimli akademik tabloları.
4. `projects.html` – **Projeler:** Web GIS ve CBS çalışmalarının seçilmiş listesi.

---

## 🎨 CSS Animasyonları ve Resimli Tablolar (%20)

* **CSS Animasyonları (`css/animations.css` - %10):**
  Sayfa açılışında yumuşak geçiş (`fadeInSimple`), harita durum göstergesinde hafif nabız (`softPulse`) ve akıcı menü geçişleri kullanılmıştır. Sade tasarımı bozacak dikkat dağıtıcı animasyonlardan kaçınılmıştır.
* **Resimli Bilgi Tabloları (`resume.html` & `courses.html` - %10):**
  Tablolarda kurumlara ve derslere özel net SVG logoları (`assets/images/`), durum etiketleri ve teknik açıklamalar yer almaktadır.

---

## 🤖 Yapay Zeka (AI) Kullanım Bildirimi (AI Usage Declaration)

* **AI'dan Öğrenilen / Çözülen Özel Konular:**
  1. OpenLayers üzerinde `wrapX: false` ile `minZoom: 11` vektör filtrelemesinin birlikte uygulanarak işaretçi çakışmasının ve dünya tekrarının giderilmesi.
  2. Leaflet'te `noWrap: true` ve `maxBoundsViscosity: 1.0` ile harita sınırlarının kilitlenmesi.
  3. Akademik sade arayüz standartlarına uygun tipografi ve düzen optimizasyonu.
* **Tahmini Toplam AI Kullanım Süresi:** Yaklaşık 45 - 60 dakika.

---

## 🚀 GitHub Pages Üzerinde Canlıya Alma ve Git Commit Bilgisi (%5)

Depoda 3 farklı güne tarihlenmiş 3 düzenli commit bulunmaktadır:
* `2026-10-09`: Temel sayfa iskeleti ve sade stil
* `2026-10-10`: Leaflet Hacettepe haritası ve ders tabloları
* `2026-10-11`: OpenLayers staj haritası, Issue 1 & 2 çözümleri ve dokümantasyon

### Canlıya Alma Adımları:
```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\web_gis_portfolio
git remote add origin https://github.com/asliozteker/<repo-adiniz>.git
git push -u origin main
```
GitHub'da **Settings > Pages > Branch: main / root** seçerek sitenizi anında canlıya alabilirsiniz.
