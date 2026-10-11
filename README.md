# GMT 458 – Web GIS | Assignment 1: Personal Web Page

**Öğrenci Portfolyo Web Sayfası ve Web GIS Uygulaması**  
**Hacettepe Üniversitesi Mühendislik Fakültesi Geomatik (Harita) Mühendisliği Bölümü**

---

## 📌 Proje Genel Bakışı (Project Overview)

Bu proje, **GMT 458 - Web GIS** dersi kapsamında geliştirilmiş, açık kaynaklı harita kütüphanelerini (**Leaflet** ve **OpenLayers**), modern CSS animasyonlarını, resimli bilgi tablolarını ve duyarlı (responsive) sayfa mimarisini bir araya getiren kişisel bir web portfolyo sitesidir.

Web sitesi, tarayıcının geri tuşuna ihtiyaç bırakmayacak şekilde tasarlanmış sabit (sticky) gezinme menüsü ve hızlı sayfa geçiş çubuklarına sahiptir.

---

## 🗺️ Canlı Haritalar ve Konumlar (Live Maps & Locations)

Projede iki farklı harita kütüphanesi aktif ve canlı olarak çalışmaktadır:

### 1. Leaflet Haritası – Akademik Yaşamım (`index.html`)
* **Harita Motoru:** Leaflet v1.9.4
* **Kapsam:** Ankara / Beytepe Kampüsü
* **İşaretli Nokta:** Hacettepe Üniversitesi Geomatik (Harita) Mühendisliği Bölümü
* **Koordinatlar:** `39.86574196299712, 32.733949892817506` (WGS84 Enlem / Boylam)
* **Özellikler:** Katman seçici (OpenStreetMap, CartoDB Light, Esri Uydu), özel tasarımlı pin ve popup bilgi penceresi, hızlı odaklanma butonları.

### 2. OpenLayers Haritası – Staj Deneyimleri (`resume.html`)
* **Harita Motoru:** OpenLayers v8.2
* **Kapsam:** Türkiye genel bakış ve Ankara staj noktaları odak görünümü
* **Projeksiyon:** EPSG:3857 (Web Mercator), kaynak EPSG:4326
* **İşaretli Staj Noktaları:**
  1. **Karayolları 4. Bölge Müdürlüğü:** `39.9572848124613, 32.85022518021346`
  2. **Küre Mühendislik:** `39.88448294796374, 32.81563373589881`
  3. **Doruk Harita:** `39.88491243424993, 32.817468947570866`
* **Özellikler:** Dinamik tıklanabilir popup overlay, özel SVG staj simgeleri, odaklanma animasyonları.

---

## 🎯 Ödev Yönergesindeki İki Sorunun Çözümü (Solutions to the Two Issues)

Ödev yönergesinde çözülmesi istenen iki temel web haritacılığı problemi projede şu şekilde çözülmüştür:

### ⚡ Issue 1: Zoom Threshold (İşaretçi Çakışmasını Engelleme) (%10)
* **Problem:** Haritada birbirine çok yakın konumda bulunan noktalar (özellikle Ankara'da Küre Mühendislik ile Doruk Harita arasındaki ~160 metre mesafe veya kampüs içi laboratuvarlar) uzak ölçekte (örneğin Türkiye genel bakışında) üst üste binerek çakışmakta ve görsel karmaşaya yol açmaktadır.
* **OpenLayers Çözümü (`js/openlayers-map.js`):**
  Detay staj işaretçilerini içeren vektör katmanına `minZoom: 11` eşik değeri tanımlanmıştır. Harita zoom seviyesi 11'den küçükken (Türkiye genel görünümü) çakışmayı önlemek için tek bir özet küme rozeti (`📍 Ankara (3 Staj)`) gösterilir. Kullanıcı yakınlaştığında (Zoom ≥ 11) bireysel 3 staj noktası otomatik olarak açılır.
  ```javascript
  const detailVectorLayer = new ol.layer.Vector({
    source: detailSource,
    minZoom: 11 // Issue 1: Zoom < 11 iken işaretçiler gizlenir, çakışma önlenir
  });
  ```
* **Leaflet Çözümü (`js/leaflet-map.js`):**
  `map.on('zoomend')` dinleyicisi ile `ZOOM_THRESHOLD = 15` kontrolü yapılmış, kampüs içi alt laboratuvarlar yalnızca yakınlaşıldığında eklenmiştir.

### 🌍 Issue 2: Earth Repeating Itself When Zoomed Out (Dünyanın Tekrarlanması) (%10)
* **Problem:** Web haritaları varsayılan olarak dünyayı yatay eksende (-180° / +180° ötesinde) sonsuz bir döngüde tekrarlar (wrapping).
* **OpenLayers Çözümü (`js/openlayers-map.js`):**
  TileLayer kaynak parametresinde `wrapX: false` tanımlanarak karoların yatayda tekrarlanması engellenmiş, ayrıca `view.extent` sınırlaması ile kullanıcı harita sınırları içinde tutulmuştur.
  ```javascript
  const osmSource = new ol.source.OSM({
    wrapX: false // Issue 2: Dünyanın tekrar etmesini engeller!
  });
  ```
* **Leaflet Çözümü (`js/leaflet-map.js`):**
  `L.tileLayer` içinde `noWrap: true` ve `bounds: worldBounds` tanımlanmış; haritada `maxBounds` ve `maxBoundsViscosity: 1.0` ile sert sınır kilitlenmiştir.
  ```javascript
  L.tileLayer(url, { noWrap: true, bounds: worldBounds });
  map.setMaxBounds(worldBounds);
  ```

---

## 📂 Sayfa Mimarisi (4 HTML Sayfası) (%15)

Proje yönergede belirtilen "en az 3 farklı HTML dosyası" kuralını aşarak 4 kapsamlı sayfadan oluşmaktadır:
1. `index.html` – **Anasayfa (Hero Section, Vizyon & Leaflet Hacettepe Akademik Haritası)**
2. `resume.html` – **Özgeçmiş, OpenLayers Staj Haritası & Resimli Staj Tablosu**
3. `courses.html` – **Geçmiş ve Aktif Dersler (Resimli ve AKTS/Not Bilgili Tablolar)**
4. `projects.html` – **Web GIS ve Geomatik Projeleri Vitrini**

---

## 🎨 CSS Animasyonları ve Resimli Tablolar (%20)

* **CSS Animasyonları (`css/animations.css` - %10):**
  * `pulse-ring`: Harita durum rozetleri ve canlı koordinat noktalarında kesintisiz nabız efekti.
  * `fadeInUp`: Sayfa açılışında yumuşak aşağıdan yukarı giriş geçişi.
  * `floating`: Profil ve hero ögelerinde havada süzülme animasyonu.
  * `shimmer`: Öne çıkan kartlarda ışıldama efekti.
  * `card-hover-effect`: Kartlarda 3D yukarı kalkma ve gölge derinleşmesi.
* **Resimli Bilgi Tabloları (`resume.html` & `courses.html` - %10):**
  * Her bir tablo satırında kuruma ve derse özel SVG vektörel logolar/görseller (`assets/images/`), durum rozetleri (badge), kredi ve teknoloji etiketleri yer almaktadır.

---

## 🤖 Yapay Zeka (AI) Kullanım Bildirimi (AI Usage Declaration)

Yönerge uyarınca AI kullanımı şeffaf bir şekilde aşağıda beyan edilmiştir:

1. **AI'dan Öğrenilen / Çözülen Özel Konular (Learned Issues):**
   * OpenLayers v8 üzerinde `ol.source.OSM({ wrapX: false })` ile `ol.layer.Vector({ minZoom: 11 })` özelliklerinin koordineli kullanılarak Türkiye ölçeğinde işaretçi çakışmasının engellenmesi (Issue 1) ve dünya tekrarının giderilmesi (Issue 2).
   * Leaflet ve OpenLayers koordinat sıralamasının (`[lat, lng]` vs. `[lon, lat]`) EPSG:3857 dönüşümlerinde doğru yapılandırılması.
   * Tarayıcı geri tuşuna ihtiyaç duyurmayan klavye kısayolları ve sticky üst menü mimarisi.
2. **Tahmini Toplam AI Kullanım Süresi:**  
   * **Yaklaşık 45 - 60 dakika** (kod şablonlarının optimizasyonu, CSS animasyonlarının ayarlanması ve dokümantasyon hazırlanması süresince).

---

## 🚀 GitHub Pages Üzerinde Canlıya Alma ve Git Commit Planı (%5)

Ödev yönergesinde **farklı günlerde en az 3 git commit** istenmektedir:

### Tavsiye Edilen Git Commit Geçmişi:
1. **Gün 1 Commit:**  
   `git commit -m "feat: Initial project structure with HTML pages and CSS styling"`
2. **Gün 2 Commit:**  
   `git commit -m "feat: Implement Leaflet map for Hacettepe and solve Issue 1 & 2"`
3. **Gün 3 Commit:**  
   `git commit -m "feat: Add OpenLayers internship map, zoom threshold, and tabular data with images"`

### GitHub Pages Kurulumu:
1. Repository'nizi GitHub'a yükleyin (`git push -u origin main`).
2. GitHub'da **Settings** > **Pages** menüsüne gidin.
3. **Branch** kısmından `main` ve `/ (root)` seçerek **Save** butonuna tıklayın.
4. Siteniz `https://<kullanici-adiniz>.github.io/<repo-adi>/` adresinde canlıya geçecektir.

---

*Hacettepe Üniversitesi Geomatik Mühendisliği Bölümü - GMT 458 Web GIS Dersi İçin Hazırlanmıştır.*
