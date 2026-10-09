/**
 * Web GIS Portfolyo - Ana JavaScript Dosyası
 * Sayfa yönlendirmeleri, mobil menü ve genel etkileşim fonksiyonları
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobil Menü Açma / Kapama
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isExpanded = navLinks.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // 2. Aktif Sayfa Bağlantısını Belirleme (Navbar Vurgusu)
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-link');
  const switchPills = document.querySelectorAll('.switch-pill');

  navItems.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  switchPills.forEach(pill => {
    const pillHref = pill.getAttribute('href');
    if (pillHref === currentPath || (currentPath === '' && pillHref === 'index.html')) {
      pill.classList.add('current');
    }
  });

  // 3. Klavye Gezinme Kısayolu (1, 2, 3, 4 tuşları ile doğrudan sayfa değiştirme)
  // Geri tuşuna ihtiyaç kalmadan hızlı tek tuşla sayfalar arası atlama
  document.addEventListener('keydown', (e) => {
    // Input veya textarea üzerinde değilken çalışsın
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === '1') window.location.href = 'index.html';
    if (e.key === '2') window.location.href = 'resume.html';
    if (e.key === '3') window.location.href = 'courses.html';
    if (e.key === '4') window.location.href = 'projects.html';
  });
});
