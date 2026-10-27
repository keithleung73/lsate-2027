/* LSATE 2027 — site behaviour (no dependencies) */
(function () {
  'use strict';
  var doc = document.documentElement;
  var EN = window.LSATE_EN || {};
  var ZH = {};                         // filled from the HTML (Chinese is the default text)
  var ZH_EXTRA = window.LSATE_ZH_EXTRA || {};
  var lang = 'en';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Language toggle ---------- */
  var textEls = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var attrEls = Array.prototype.slice.call(document.querySelectorAll('[data-i18n-attr]'));

  function parseAttr(el) {
    return el.getAttribute('data-i18n-attr').split(';').map(function (pair) {
      var i = pair.indexOf(':');
      return { attr: pair.slice(0, i).trim(), key: pair.slice(i + 1).trim() };
    });
  }
  // Remember the original (Chinese) content of every element
  textEls.forEach(function (el) {
    var k = el.getAttribute('data-i18n');
    el._zh = el.innerHTML;
    if (!(k in ZH)) ZH[k] = el.innerHTML;
  });
  attrEls.forEach(function (el) {
    el._zhAttr = {};
    parseAttr(el).forEach(function (p) {
      el._zhAttr[p.attr] = el.getAttribute(p.attr) || ZH[p.key] || '';
      if (!(p.key in ZH)) ZH[p.key] = el._zhAttr[p.attr];
    });
  });
  Object.keys(ZH_EXTRA).forEach(function (k) { ZH[k] = ZH_EXTRA[k]; });

  function t(key) {
    if (lang === 'en' && key in EN) return EN[key];
    return key in ZH ? ZH[key] : (EN[key] || key);
  }
  window.LSATE_t = t;

  function applyLang(l) {
    lang = l === 'en' ? 'en' : 'zh';
    textEls.forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (lang === 'en') {
        if (k in EN) {
          if (el.tagName === 'TITLE') el.textContent = EN[k]; else el.innerHTML = EN[k];
        } else if (window.console) console.warn('[i18n] missing English for', k);
      } else {
        el.innerHTML = el._zh;
      }
    });
    attrEls.forEach(function (el) {
      parseAttr(el).forEach(function (p) {
        var v = lang === 'en' && p.key in EN ? EN[p.key] : el._zhAttr[p.attr];
        el.setAttribute(p.attr, v.replace(/<[^>]+>/g, ''));
      });
    });
    // keep real photos' alt text in the current language
    document.querySelectorAll('.photo.has-photo').forEach(function (fig) {
      var im = fig.querySelector('img'); if (im) im.alt = fig.getAttribute('data-alt') || '';
    });
    doc.lang = lang === 'en' ? 'en' : 'zh-Hant-HK';
    doc.removeAttribute('data-pending-lang');
    var tg = document.getElementById('lang-toggle');
    if (tg) tg.setAttribute('data-active', lang);
    syncMenuLabel();
    tick(true);
    try {
      localStorage.setItem('lsate-lang', lang);
      localStorage.setItem('lsate-lang-default', 'en');
    } catch (e) {}
  }

  function readSavedLang() {
    try {
      if (localStorage.getItem('lsate-lang-default') !== 'en') return 'en';
      return localStorage.getItem('lsate-lang') === 'zh' ? 'zh' : 'en';
    } catch (e) { return 'en'; }
  }
  var saved = readSavedLang();

  /* ---------- 2. Mobile menu ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  function menuOpen() { return navToggle && navToggle.getAttribute('aria-expanded') === 'true'; }
  function syncMenuLabel() {
    if (navToggle) navToggle.setAttribute('aria-label', t(menuOpen() ? 'a11y.menuClose' : 'a11y.menu'));
  }
  function setMenu(open) {
    navToggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    syncMenuLabel();
  }
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () { setMenu(!menuOpen()); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a') && menuOpen()) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen()) { setMenu(false); navToggle.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth >= 960 && menuOpen()) setMenu(false); });
  }

  /* ---------- 3. Countdown to 15 May 2027, 8:30 a.m. HK time (registration starts) ---------- */
  var target = Date.parse('2027-05-15T08:30:00+08:00');
  var cd = {};
  ['days', 'hours', 'minutes', 'seconds'].forEach(function (u) { cd[u] = document.querySelector('[data-unit="' + u + '"]'); });
  var timer = null;
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function tick(once) {
    if (!cd.days) return;
    var diff = Math.max(0, target - Date.now());
    var s = Math.floor(diff / 1000);
    cd.days.textContent = Math.floor(s / 86400);
    cd.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    cd.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    cd.seconds.textContent = pad(s % 60);
    if (diff === 0) {
      var note = document.getElementById('cd-note');
      if (note) note.innerHTML = t('cd.done');
      return;
    }
    if (!once) { clearTimeout(timer); timer = setTimeout(tick, 1000); }
  }

  /* ---------- 4. Language button ---------- */
  var langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.addEventListener('click', function () { applyLang(lang === 'zh' ? 'en' : 'zh'); });
  applyLang(saved);
  tick();

  /* ---------- 5. Header shadow + back-to-top ---------- */
  var header = document.querySelector('.site-header');
  var toTop = document.querySelector('.to-top');
  function onScroll() {
    var y = window.scrollY || 0;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (toTop) toTop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 6. Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) {
      // small stagger for siblings in the same list
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = Math.min(idx, 5) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 7. YouTube (click-to-play, light) ---------- */
  document.querySelectorAll('.yt[data-youtube-id]').forEach(function (box) {
    var id = (box.getAttribute('data-youtube-id') || '').trim();
    if (!/^[A-Za-z0-9_-]{6,}$/.test(id)) return;            // empty -> keep placeholder
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'yt-thumb';
    btn.style.backgroundImage = 'url(https://i.ytimg.com/vi/' + id + '/hqdefault.jpg)';
    btn.innerHTML = '<span class="yt-play" aria-hidden="true"></span>';
    btn.setAttribute('aria-label', t('media.play') + ': ' + (box.getAttribute('data-title') || ''));
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      f.title = box.getAttribute('data-title') || 'Video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.allowFullscreen = true;
      box.innerHTML = '';
      box.appendChild(f);
    });
    box.innerHTML = '';
    box.appendChild(btn);
  });

  /* ---------- 8. Photos + lightbox ---------- */
  var lb = document.getElementById('lightbox');
  document.querySelectorAll('.photo[data-photo]').forEach(function (fig) {
    var src = (fig.getAttribute('data-photo') || '').trim();
    if (!src) return;                                        // empty -> keep placeholder
    var cap = fig.querySelector('figcaption');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'photo-btn';
    var img = document.createElement('img');
    img.src = src; img.loading = 'lazy';
    img.alt = fig.getAttribute('data-alt') || (cap ? cap.textContent : '');
    btn.appendChild(img);
    var ph = fig.querySelector('.photo-ph');
    if (ph) fig.replaceChild(btn, ph); else fig.insertBefore(btn, fig.firstChild);
    fig.classList.add('has-photo');
    btn.addEventListener('click', function () {
      if (!lb || typeof lb.showModal !== 'function') { window.open(src, '_blank'); return; }
      lb.querySelector('img').src = src;
      lb.querySelector('img').alt = img.alt;
      lb.querySelector('figcaption').textContent = cap ? cap.textContent : '';
      lb._opener = btn;
      lb.showModal();
    });
  });
  if (lb) {
    lb.querySelector('.lightbox-close').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', function () { if (lb._opener) lb._opener.focus(); });
  }

  /* ---------- 9. Sample registration form (does NOT send anything) ---------- */
  var form = document.getElementById('reg-form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var st = document.getElementById('form-status');
    if (st) st.textContent = t('reg.done');
  });

  /* ---------- 10. FAQ: only one open at a time ---------- */
  var faqs = document.querySelectorAll('.faq-list details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- 11. Promo video popup (every page load) ---------- */
  var promo = document.getElementById('promo-popup');
  var promoVideo = document.getElementById('promo-video');
  if (promo && promoVideo && typeof promo.showModal === 'function') {
    function stopPromoVideo() {
      try { promoVideo.pause(); } catch (e) {}
      try { promoVideo.currentTime = 0; } catch (e) {}
    }

    var promoCloseBtn = promo.querySelector('.lightbox-close');
    if (promoCloseBtn) promoCloseBtn.addEventListener('click', function () { promo.close(); });
    promo.addEventListener('click', function (e) { if (e.target === promo) promo.close(); });
    promo.addEventListener('close', function () {
      stopPromoVideo();
      var hint = document.getElementById('promo-unmute-hint');
      if (hint) hint.hidden = true;
    });
    promoVideo.addEventListener('volumechange', function () {
      if (!promoVideo.muted && promoVideo.volume > 0) {
        var hint = document.getElementById('promo-unmute-hint');
        if (hint) hint.hidden = true;
      }
    });

    setTimeout(function () {
      if (promo.open) return;
      try { promo.showModal(); } catch (e) { return; }
      if (reduceMotion) {
        // Show dialog but let the user press play
        promoVideo.muted = false;
        return;
      }
      promoVideo.muted = true;
      var hint = document.getElementById('promo-unmute-hint');
      if (hint) hint.hidden = false;
      var playPromise = promoVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () { /* autoplay blocked — controls still available */ });
      }
    }, 800);
  }
})();
