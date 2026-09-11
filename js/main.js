(function () {
  'use strict';

  // Mobile navigation
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Highlight current page
  var path = location.pathname.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '');
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    var href = a.getAttribute('href').replace(/\.html$/, '');
    if (href === path || (href !== '/' && path.indexOf(href) === 0)) {
      a.setAttribute('aria-current', 'page');
    }
  });

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Project filters
  var filters = document.querySelector('.filters');
  if (filters) {
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      filters.querySelectorAll('button').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var cat = btn.getAttribute('data-filter');
      document.querySelectorAll('.project').forEach(function (p) {
        var show = cat === 'all' || p.getAttribute('data-cat') === cat;
        p.classList.toggle('is-hidden', !show);
      });
    });
  }

  // Contact form (Web3Forms)
  var form = document.getElementById('contact-form');
  if (form) {
    var status = form.querySelector('.form__status');
    var button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var key = form.querySelector('input[name="access_key"]').value;
      if (!key || key.indexOf('REPLACE') === 0) {
        status.className = 'form__status is-err';
        status.textContent = 'The contact form is not connected yet. Please email info@southlinesurveying.com directly.';
        return;
      }
      status.className = 'form__status';
      button.disabled = true;
      var original = button.innerHTML;
      button.textContent = 'Sending...';
      var data = new FormData(form);
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res.success) {
          status.className = 'form__status is-ok';
          status.textContent = 'Thank you. Your request was received and we will respond within one business day.';
          form.reset();
        } else {
          throw new Error(res.message || 'Submission failed');
        }
      }).catch(function () {
        status.className = 'form__status is-err';
        status.textContent = 'Something went wrong sending your request. Please email info@southlinesurveying.com directly.';
      }).finally(function () {
        button.disabled = false;
        button.innerHTML = original;
      });
    });
  }

  // Footer year
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
