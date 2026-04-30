(function () {
  document.documentElement.classList.add('js');

  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in'), i * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
    }, 3000);
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }
})();
