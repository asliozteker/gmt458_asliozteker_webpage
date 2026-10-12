# GMT 458 – Web GIS | Assignment 1: Personal Web Page

**Öğrenci / Student:** Aslı Özteker  
**Bölüm / Department:** Hacettepe Üniversitesi, Geomatik Mühendisliği Bölümü (Department of Geomatics Engineering)  
**Ders / Course:** GMT 458 – İnternet Tabanlı Coğrafi Bilgi Sistemleri (Web GIS)  
**Dönem / Term:** Fall 2026–2027  

---

## 📌 Proje Genel Bakışı & Değerlendirme Kriterleri Uyumu (Rubric Compliance)

Bu proje, Hacettepe Üniversitesi Geomatik Mühendisliği Bölümü GMT 458 dersi 1. Ödevi kapsamında geliştirilmiş kişisel akademik Web GIS platformudur. Proje; modern web standartları, istemci taraflı harita kütüphaneleri (Leaflet JS ve OpenLayers), duyarlı (responsive) CSS tasarımı ve bilinçli yazılım geliştirme pratikleri doğrultusunda hazırlanmıştır.

| Kriter (Rubric Criterion) | Ağırlık | Gerçekleştirim Detayları (Implementation Details) |
| :--- | :---: | :--- |
| **HTML Structure** | **%15** | 5 adet anlamsal (semantic) HTML sayfası (`index.html`, `home.html`, `resume.html`, `courses.html`, `contact.html`). Sabit (sticky) üst navigasyon çubuğu ile sayfalar arası kesintisiz gezinme sağlanmıştır. |
| **CSS Animations** | **%10** | Özel CSS animasyonları: Aktif sekme geçiş çizgisi (`#7c3aed` mor vurgu), harita durum nabız göstergesi (`pulse-indicator`), yumuşak sayfa açılış efekti (`fade-in`), sıçrayan konum pini (`anim-pin-bounce`) ve 3D Canvas küre warp geçişi. |
| **Tabular Info with Images** | **%10** | `resume.html` sayfasında 3 sütunlu staj tablosu ve 3 sütunlu teknik yetkinlikler ızgarası; `courses.html` sayfasında ise 9 adet aktif lisans dersi, müfredat odakları ve her derse özel tasarlanmış vektörel siyah-beyaz SVG ikonları. |
| **Leaflet Map (Ankara)** | **%10** | `home.html` sayfasında Hacettepe Üniversitesi Geomatik Mühendisliği Bölümü merkezli (`39.865742° N, 32.733950° E`) canlı Leaflet haritası. Esri Street Map ve Esri Satellite altlıkları, dinamik zoom seviyesi göstergesi ve odak butonları. |
| **OpenLayers Map (Turkey)** | **%10** | `resume.html` sayfasında OpenLayers v8.2 ile oluşturulan staj haritası (Karayolları 4. Bölge Md., Küre Mühendislik, Doruk Harita). Tek tıkla uydu/sokak haritası katman değiştirme, Ankara ve Türkiye genel bakış odaklama. |
| **Marker Zoom Threshold** | **%10** | Küçük ölçekte (ülke genelinde) birbirine çok yakın noktaların (~160 m) çakışmasını engellemek amacıyla OpenLayers haritasında `minZoom: 11` eşik filtresi ve bölgesel kümeleme; Leaflet haritasında ise `Zoom >= 15` laboratuvar eşik kontrolü. |
| **Earth Repeating Prevention** | **%10** | Uzaklaşıldığında haritanın yatayda sonsuz tekrar etmesini engellemek için OpenLayers XYZ Tile kaynağında `wrapX: false`, Leaflet haritasında ise `noWrap: true` ve `maxBounds` kısıtlamaları uygulanmıştır. |
| **Git Usage (Multi-day)** | **%5** | Çoklu günlere yayılmış (`2026-10-09`, `2026-10-10`, `2026-10-11`, `2026-10-12`), anlamlı ve açıklayıcı commit mesajlarına sahip düzenli sürüm kontrol geçmişi. |
| **Design & Quality** | **%10** | Akademik kimliğe uygun, minimalist ve göz yormayan kartografik tasarım. Arka planda zarif topoğrafik eşyükselti eğrileri ve geodezik pafta filigranı; içerik alanında %100 saf beyaz kart ve hatasız tipografi. |

---

## 🗺️ Canlı Haritalar ve Koordinat Bilgileri

### 1. Leaflet JS Haritası – Akademik Konum (`home.html`)
* **Odak Noktası:** Hacettepe Üniversitesi Geomatik Mühendisliği Bölümü, Beytepe Kampüsü
* **Koordinatlar:** `39.865742° N, 32.733950° E`
* **Kullanılan Altlıklar:** Esri World Street Map, Esri World Imagery (Uydu)
* **Öne Çıkan Özellikler:** Dinamik zoom takibi, bölüm binasına özel interaktif popup bilgi penceresi, hızlı odak butonları.

### 2. OpenLayers Haritası – Staj Deneyimleri (`resume.html`)
* **Staj Yapılan Kurum ve Kuruluşlar:**
  * **Karayolları Genel Müdürlüğü (4. Bölge Müdürlüğü):** `39.957285° N, 32.850225° E` (İmar Planları ve Altyapı Haritalama)
  * **Küre Mühendislik:** `39.884483° N, 32.815634° E` (Fotogrametri)
  * **Doruk Harita & Mühendislik:** `39.884912° N, 32.817469° E` (Fotogrametri)
* **Öne Çıkan Özellikler:** Vektörel pin katmanları, özelleştirilmiş bilgi penceresi (overlay popup), katman değiştirici (Layer Switcher).

---

## 🎯 Teknik CBS ve Web Çözümleri

### 1. İşaretçi Çakışmasını ve Zoom Eşiğini Yönetme (Marker Zoom Threshold)
CBS tabanlı haritalarda küçük ölçeklerde (Zoom < 11) birbirine yakın noktalar üst üste binerek okunaksızlık yaratır. Özellikle Çankaya bölgesinde yer alan Küre Harita ile Doruk Harita arasındaki mesafe kuş uçuşu yaklaşık 160 metredir. Bu durum şu şekilde çözülmüştür:
* **OpenLayers:** Türkiye genel bakışında kurumlar tek bir bölgesel küme noktası altında toplanır; kullanıcı Ankara seviyesine yaklaştığında (`minZoom: 11`) bireysel kurum noktaları ve detay popup'ları görünür hale gelir.
* **Leaflet:** Bölüm genel bakışı ile iç mekan/laboratuvar detayları zoom seviyesi 15 ve üzerine çıktığında ayrışır.

### 2. Sonsuz Dünya Tekrarını Engelleme (Prevent Earth Repeating)
Web Mercator (EPSG:3857) projeksiyonunda dünya haritası yatay eksende varsayılan olarak sonsuz döngüde tekrarlanır. Ödev isterlerine tam uyum için:
* **Leaflet Entegrasyonu:** `L.tileLayer` nesnesinde `noWrap: true` parametresi tanımlanmış ve haritanın kaydırılabilir sınırları `maxBounds: [[-85, -180], [85, 180]]` ve `maxBoundsViscosity: 1.0` ile sınırlandırılmıştır.
* **OpenLayers Entegrasyonu:** `ol.source.XYZ` katman kaynağı oluşturulurken `wrapX: false` özelliği eklenerek kıtaların sağa ve sola sonsuz tekrar etmesi engellenmiştir.

---

## 📂 Web Sayfaları Mimarisi

* `index.html`: Ziyaretçiyi karşılayan, HTML5 Canvas 2D üzerinde saf trigonometrik projeksiyonla dönen minimalist 3D dünya küresi ve Ankara/Hacettepe nabız pini içeren giriş sayfası. Tıklandığında akıcı warp efektiyle ana sayfaya geçer.
* `home.html`: Biyografi (About Me), akademik ilgi alanları ve canlı Hacettepe Leaflet kampüs haritası.
* `resume.html`: *Internships & Skills* sayfası; OpenLayers staj haritası, 3 sütunlu staj deneyimleri tablosu ve 3 sütunlu teknik beceri kartları (*QGIS, ArcGIS Pro, Netcad, Leaflet, OpenLayers, JavaScript, Python, PostGIS, MicroStation, GNSS/RTK, Total Station*).
* `courses.html`: 2026–2027 Güz dönemi 9 adet aktif lisans dersi, müfredat içerikleri ve özel siyah-beyaz SVG sembolleri.
* `contact.html`: Kurumsal e-posta, Ankara lokasyonu ve geomatik bölümü irtibat kartları.
* `css/style.css` & `css/animations.css`: Topoğrafik arka plan dokusu, mor aktif sekme vurgusu ve responsive tipografi stilleri.

---

## 🤖 Yapay Zeka (AI) Kullanım Bildirgesi & Bilinçli Mühendislik Süreci

* **Toplam AI Kullanım Süresi:** **2 Saat** (120 Dakika)  
* **Kullanım Yaklaşımı:** Yapay zeka bu projede tüm kodun otomatik yazdırılması amacıyla değil; ödev gereksinimlerinde yer alan teknik CBS problemlerinin araştırılması, kütüphane API farklılıklarının çözülmesi ve optimizasyon amacıyla **bilinçli, sorgulayıcı ve aşamalı bir danışmanlık aracı** olarak kullanılmıştır.

### Aşamalarla Bilinçli AI Kullanım Raporu:

#### 1. Aşama: Harita Altlıklarında HTTP 403 / Filigran Sorunlarının Giderilmesi (~25 Dakika)
* **Karşılaşılan Teknik Sorun:** OpenStreetMap standart tile sunucuları bazı tarayıcılarda ve yerel çalıştırma ortamlarında referer politikaları nedeniyle 403 Forbidden hatası verebilmekte; Mapbox ve Google Maps gibi servisler ise API anahtarı ve kredi kartı tanımlaması gerektirmektedir.
* **Bilinçli AI Sorgusu & Çözüm:** AI ile yapılan teknik istişare sonucunda, geomatik ve CBS standartlarına en uygun, API anahtarı gerektirmeyen ve güvenilir olan Esri ArcGIS REST Services XYZ tile şablonları (`server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}`) tespit edilmiş; hem Leaflet hem de OpenLayers için uyumlu altlık katmanları kurgulanmıştır.

#### 2. Aşama: İki Kritik Rubric Maddesinin İki Farklı Kütüphanede Çözümü (~35 Dakika)
* **Karşılaşılan Teknik Sorun:** Leaflet ve OpenLayers kütüphanelerinin dünya tekrarı (`wrap`) ve koordinat sistemi yaklaşımları birbirinden tamamen farklıdır. Leaflet varsayılan olarak `[Enlem, Boylam]` (Lat/Lng) dizilimini kullanırken, OpenLayers `[Boylam, Enlem]` (Lon/Lat) ve Web Mercator projeksiyon dönüşümünü (`ol.proj.fromLonLat`) zorunlu kılar.
* **Bilinçli AI Sorgusu & Çözüm:**
  * **Sonsuz Dünya Tekrarı:** Leaflet tarafında `noWrap: true` ve `maxBounds` parametrelerinin davranışı ile OpenLayers tarafında `ol.source.XYZ` üzerinde `wrapX: false` parametresinin kullanımı adım adım test edilerek doğrulanmıştır.
  * **Zoom Eşiği ve Çakışma Önleme:** Küre Mühendislik ile Doruk Harita arasındaki yaklaşık 160 metrelik yakınlığın Türkiye genel bakışında çakışma yaratmaması için OpenLayers'ta `minZoom: 11` çözünürlük filtreleme mantığı AI rehberliğinde optimize edilmiştir.

#### 3. Aşama: Giriş Sayfasındaki 3D Küresel İzdüşüm Trigonometrisi (~35 Dakika)
* **Karşılaşılan Teknik Sorun:** Ağır 3D motorları (Three.js vb.) yüklemek sayfa boyutunu ve yüklenme süresini artıracağı için, tamamen saf HTML5 Canvas ile hafif, zarif ve geodezik çizgileri olan bir dünya animasyonu tasarlanmak istendi.
* **Bilinçli AI Sorgusu & Çözüm:** Küresel koordinatların ($lat, lon$) ekran izdüşümüne ($x, y$) dönüştürülmesinde kullanılan trigonometrik formüller AI desteğiyle türetilmiş; kürenin arkasında kalan görünmez noktaların filtrelenmesi (`z > 0`), dönme açısına göre Ankara'nın anlık koordinatlarının dinamik olarak hesaplanması ve yumuşak tıklama geçişi (warp transition) kodlanmıştır.

#### 4. Aşama: UTF-8 Karakter Kararlılığı, Kartografik Tipografi ve GitHub Pages Hazırlığı (~25 Dakika)
* **Karşılaşılan Teknik Sorun:** Türkçe karakterlerin (`ı, ğ, ü, ş, ö, ç`) ve özel sembollerin (navigasyon menü simgesi `☰`) Windows konsolu ve farklı web sunucuları arasında bozulma riski ile GitHub Pages dağıtım ayarları.
* **Bilinçli AI Sorgusu & Çözüm:** Tüm dosyaların UTF-8 encoding kararlılığı denetlenmiş, `Downloads` klasöründen açılsa bile adres çubuğunun temiz görünmesini sağlayan istemci yönlendirmesi kurgulanmış ve GitHub Pages yayın süreci adım adım yapılandırılmıştır.

---

## 🚀 GitHub ve Canlı Web Sayfası Yayını (GitHub Pages)

### GitHub Profili:
👉 **[https://github.com/asliozteker](https://github.com/asliozteker)**

### Canlı Web Sayfası URL'si (GMT 458 Teslim Bağlantısı):
Portal sistemine girilecek resmi canlı bağlantı:
🌐 **`https://asliozteker.github.io/aslioztekergmt458/`**  
*(Veya repo adı `gmt458_asliozteker_webpage` olarak açıldıysa: `https://asliozteker.github.io/gmt458_asliozteker_webpage/`)*

### GitHub Pages Aktifleştirme Adımları:
1. GitHub profilinizde oluşturulan deponun ana sayfasına gidin.
2. Üst menüden **Settings** sekmesini açın.
3. Sol menüden **Pages** seçeneğine tıklayın.
4. **Build and deployment > Branch** kısmından `main` dalını ve `/ (root)` klasörünü seçip **Save** butonuna tıklayın.
5. Yaklaşık 1 dakika içinde sayfanız yukarıdaki URL üzerinden tüm dünyada erişilebilir olacaktır.
