/* ==========================================================================
   ELIJAH / DEV — site behaviour
   Everything here is progressive enhancement: the page works without it.
   ========================================================================== */

/* --------------------------------------------------------------------------
   EDIT ME — contact details and profile links live here.
   Leave a value as "" to hide it on the page.
   -------------------------------------------------------------------------- */
const CONFIG = {
  // International format, digits only, no "+", spaces or dashes.
  whatsapp: 'https://wa.me/639694589629',
  // Shown as a plain link in the contact section and footer.
  email: 'elijahflores0204@gmail.com',
  // One page that links to every social profile.
  socials: 'https://elijahflores.xyz',
  // Profile links in the footer's PROFILES column (full URLs).
  github: 'https://github.com/site-x',
  instagram: 'https://www.instagram.com/primelordd/',
  facebook: 'https://www.facebook.com/dreiixx1/',
  // Sound played when a link or button is clicked. Volume runs from 0 (silent) to 1 (full).
  clickSound: 'assets/clicksfx.mp3',
  clickVolume: 0.15,
};

(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Reloading starts from the top ---------- */
  function initReloadToTop() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const nav = performance.getEntriesByType('navigation')[0];
    if (!nav || nav.type !== 'reload') return;
    // Drop any #section left in the address so the browser doesn't jump back to it.
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  /* ---------- Contact details ---------- */
  function initContact() {
    if (CONFIG.whatsapp) {
      $$('[data-whatsapp]').forEach((a) => { a.href = CONFIG.whatsapp; });
    }

    if (CONFIG.email) {
      $$('[data-email-link]').forEach((a) => {
        a.href = `mailto:${CONFIG.email}`;
        a.textContent = CONFIG.email;
      });
    }
    if (CONFIG.socials) {
      $$('[data-socials-link]').forEach((a) => { a.href = CONFIG.socials; });
    }

    $$('[data-profile]').forEach((a) => { if (CONFIG[a.dataset.profile]) a.href = CONFIG[a.dataset.profile]; });
  }

  /* ---------- Mobile menu ---------- */
  function initNav() {
    const nav = $('[data-nav]');
    const toggle = $('[data-nav-toggle]');
    const menu = $('[data-nav-menu]');
    const label = $('[data-nav-toggle-label]');
    if (!nav || !toggle || !menu) return;

    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      label.textContent = open ? 'Close' : 'Menu';
    };
    const isOpen = () => nav.classList.contains('is-open');

    toggle.addEventListener('click', () => setOpen(!isOpen()));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('click', (e) => { if (isOpen() && !nav.contains(e.target)) setOpen(false); });
    // Leaving the mobile layout resets the panel.
    window.matchMedia('(min-width: 900px)').addEventListener('change', () => setOpen(false));

    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Active section in the nav ----------
     Marks the link for the part of the page under the middle of the screen. On the home page, the
     hero area at the top counts as HOME. A link already marked aria-current="page" (the page you
     are on, set in the HTML) is left alone. */
  function initActiveLinks() {
    const items = $$('.nav__link').map((a) => {
      const href = a.getAttribute('href') || '';
      // A link to its own page (projects.html, credentials.html) also stands for that section when the section is on this page.
      const slug = href.replace(/\.html$/, '');
      const id = href.startsWith('#') ? href.slice(1) : (/^[a-z]+\.html$/.test(href) && document.getElementById(slug) ? slug : null);
      return { a, id };
    }).filter((x) => x.id);
    const home = items.find((x) => x.id === 'top');
    const sections = items.filter((x) => x.id !== 'top')
      .map((x) => ({ a: x.a, el: document.getElementById(x.id) })).filter((x) => x.el);
    if (!home && !sections.length) return;

    const mark = (current) => items.forEach(({ a }) => {
      if (a.getAttribute('aria-current') === 'page') return;
      if (a === current) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    let queued = false;
    const update = () => {
      queued = false;
      const line = window.innerHeight * 0.45;
      const rects = sections.map((x) => ({ a: x.a, r: x.el.getBoundingClientRect() }));
      const inside = rects.find(({ r }) => r.top <= line && r.bottom > line);
      if (inside) mark(inside.a);
      else if (home && rects.every(({ r }) => r.top > line)) mark(home.a); // above every section: the top of the page
      // otherwise we are in a gap between sections: keep the current one
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    update();
  }

  /* ---------- Scroll reveals ---------- */
  function initReveals() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window) || reducedMotion.matches) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Technology marquee ---------- */
  function initMarquee() {
    const marquee = $('[data-marquee]');
    const track = $('[data-marquee-track]');
    if (!marquee || !track || reducedMotion.matches) return;
    // Repeat the list enough to cover wide screens, then one more set for the seamless loop.
    const items = $$('li', track);
    const repeats = Math.max(2, Math.ceil((window.innerWidth * 2) / Math.max(track.scrollWidth, 1)) + 1);
    for (let i = 1; i < repeats; i += 1) {
      items.forEach((li) => {
        const clone = li.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }
    track.style.setProperty('--marquee-shift', `${-100 / repeats}%`);
    track.style.setProperty('--marquee-duration', `${items.length * 4.5}s`);
    marquee.classList.add('is-running');
  }

  /* ---------- Carousel arrows (projects and badges) ---------- */
  function initCarousel() {
    $$('[data-carousel]').forEach(setupCarousel);
  }
  function setupCarousel(root) {
    const track = $('[data-carousel-track]', root);
    const prev = $('[data-carousel-prev]', root);
    const next = $('[data-carousel-next]', root);
    const navBox = prev.parentElement;

    const step = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      navBox.hidden = max <= 4; // every card already fits
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= max - 4;
    };
    const move = (dir) => track.scrollBy({ left: dir * step(), behavior: reducedMotion.matches ? 'auto' : 'smooth' });

    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ---------- Badge details: click a badge, see its details, then verify on Credly ---------- */
  function initBadges() {
    const dialog = $('[data-badge-dialog]');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const body = $('[data-badge-body]', dialog);
    body.tabIndex = -1; // focusable by script only, so it can take the first scroll
    const viewAllHref = dialog.dataset.badgeViewall || '';
    let opener = null;
    let parent = null; // the stacked certificate's view (body + bar), kept while one of its items is open
    // Move focus only for keyboard users (see initPointerFocus).
    const keyboard = () => !document.documentElement.classList.contains('is-pointer');
    const focus = (el) => { if (keyboard() && el) el.focus(); };

    // Bottom bar: a round back button + the view's verify button. It sits outside the scrolling
    // body, over its bottom edge, so it never moves while the content scrolls (and blurs) behind it.
    const bar = document.createElement('div');
    bar.className = 'badge-dialog__bar';
    dialog.append(bar);
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'badge-dialog__back';
    back.setAttribute('aria-label', 'Back');
    back.innerHTML = '<span aria-hidden="true">←</span>';

    const show = (view) => {
      body.replaceChildren(...view.body);
      bar.replaceChildren(back, ...view.bar);
      body.scrollTop = 0;
    };
    // Splits a template into its content and its verify button (the last .btn), which goes in the bar.
    const viewOf = (template, withViewAll = true) => {
      const fragment = template.content.cloneNode(true);
      // Template content isn't in the page when initContact runs, so set WhatsApp links here.
      if (CONFIG.whatsapp) fragment.querySelectorAll('[data-whatsapp]').forEach((a) => { a.href = CONFIG.whatsapp; });
      const verify = [...fragment.querySelectorAll('.btn')].pop();
      if (verify) verify.remove();
      const actions = verify ? [verify] : [];
      // Home/About popups: the main button goes to the credentials page, and verify shrinks to an icon.
      if (viewAllHref && withViewAll) {
        if (verify) {
          verify.className = 'badge-dialog__back';
          verify.setAttribute('aria-label', 'Verify certificate (opens in a new tab)');
          verify.innerHTML = '<span aria-hidden="true">↗</span>';
        }
        const all = document.createElement('a');
        all.className = 'btn btn--red';
        all.href = viewAllHref;
        all.innerHTML = 'VIEW ALL <span aria-hidden="true">→</span>';
        actions.push(all);
      }
      return { body: [...fragment.childNodes], bar: actions };
    };
    const current = () => ({ body: [...body.childNodes], bar: [...bar.childNodes].filter((n) => n !== back) });

    $$('[data-badge]').forEach((btn) => {
      btn.addEventListener('click', () => {
        opener = btn;
        parent = null;
        // The button is the card/badge's own <li> child or one level down (project cards), so find its <li>.
        show(viewOf(btn.closest('li').querySelector(':scope > template'), !btn.closest('#projects')));
        document.documentElement.classList.add('has-dialog'); // locks page scrolling behind the popup
        dialog.showModal();
        // showModal focuses the close button; for touch/mouse, focus the scrolling body instead
        // so the first swipe or wheel scrolls it straight away.
        if (!keyboard()) body.focus({ preventScroll: true });
      });
    });

    // Items inside a stacked certificate (course certificates, course badges) open in the same popup.
    body.addEventListener('click', (e) => {
      const subBtn = e.target.closest('[data-sub]');
      if (!subBtn) return;
      parent = current();
      show(viewOf(subBtn.nextElementSibling));
      focus(back);
    });
    // Wheel over the row of items scrolls it sideways, eased toward a target; elsewhere (or at the
    // row's ends) the popup scrolls normally. When the wheel pauses, the row settles on the nearest item.
    let glide = null; // { row, target, idle, raf }
    const stopGlide = () => {
      if (!glide) return;
      cancelAnimationFrame(glide.raf);
      clearTimeout(glide.idle);
      glide.row.style.scrollSnapType = '';
      glide = null;
    };
    const tick = () => {
      const g = glide;
      const diff = g.target - g.row.scrollLeft;
      if (Math.abs(diff) < 0.5) {
        g.row.scrollLeft = g.target;
        g.raf = 0;
        return;
      }
      g.row.scrollLeft += diff * 0.2;
      g.raf = requestAnimationFrame(tick);
    };
    body.addEventListener('wheel', (e) => {
      const row = e.target.closest('.subs');
      if (!row || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const max = row.scrollWidth - row.clientWidth;
      if (max <= 4) return;
      if (glide && glide.row !== row) stopGlide();
      const from = glide ? glide.target : row.scrollLeft;
      if ((from <= 0 && e.deltaY < 0) || (from >= max - 1 && e.deltaY > 0)) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? row.clientWidth : 1;
      const target = Math.max(0, Math.min(max, from + e.deltaY * unit));
      if (reducedMotion.matches) { row.scrollLeft = target; return; }
      if (!glide) glide = { row, target, idle: 0, raf: 0 };
      glide.target = target;
      row.style.scrollSnapType = 'none'; // snapping would pull each step back
      if (!glide.raf) glide.raf = requestAnimationFrame(tick);
      clearTimeout(glide.idle);
      glide.idle = setTimeout(() => {
        const first = row.firstElementChild.offsetLeft;
        const stops = [...row.children].map((li) => li.offsetLeft - first);
        glide.target = stops.reduce((best, x) => (Math.abs(x - glide.target) < Math.abs(best - glide.target) ? x : best), stops[0]);
        if (!glide.raf) glide.raf = requestAnimationFrame(tick);
        glide.idle = setTimeout(stopGlide, 600); // back to normal snapping once settled
      }, 140);
    }, { passive: false });
    // Back: from a course/badge to its certificate; from the top level it closes the popup.
    back.addEventListener('click', () => {
      if (parent) {
        show(parent);
        parent = null;
      } else {
        dialog.close();
      }
    });
    $('[data-badge-close]', dialog).addEventListener('click', () => dialog.close());
    // A click on the backdrop lands on the dialog element itself.
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('has-dialog');
      focus(opener);
    });
  }

  /* ---------- Focus ring for keyboard users only ----------
     Touch and mouse users get no focus outline (phones were drawing a white one on taps). */
  function initPointerFocus() {
    const root = document.documentElement;
    document.addEventListener('pointerdown', () => root.classList.add('is-pointer'), true);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' || e.key.startsWith('Arrow')) root.classList.remove('is-pointer');
    }, true);
  }

  /* ---------- Click sound (clicks only, never hover) ---------- */
  function initClickSound() {
    const sound = new Audio(CONFIG.clickSound);
    sound.preload = 'auto';
    sound.volume = CONFIG.clickVolume;
    document.addEventListener('click', (e) => {
      if (!e.target.closest('a, button')) return;
      sound.currentTime = 0;
      sound.play().catch(() => {}); // ignored if the browser blocks audio
    });
  }

  /* ---------- Hero showreel: the play button restarts it with sound and controls ---------- */
  function initReel() {
    const reel = $('[data-reel]');
    if (!reel) return;
    const video = $('video', reel);
    const play = $('.hero__play', reel);
    play.addEventListener('click', () => {
      video.muted = false;
      video.loop = false;
      video.controls = true;
      video.currentTime = 0;
      reel.classList.add('is-playing');
      video.play().catch(() => { video.muted = true; video.play(); });
    });
    video.addEventListener('ended', () => {
      video.controls = false;
      video.muted = true;
      video.loop = true;
      reel.classList.remove('is-playing');
      video.play();
    });
  }

  /* ---------- Back to top + footer year ---------- */
  function initChrome() {
    const year = $('[data-year]');
    if (year) year.textContent = String(new Date().getFullYear());

    const toTop = $('[data-to-top]');
    if (toTop) {
      toTop.hidden = false;
      const onScroll = () => toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.9);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  [initPointerFocus, initReloadToTop, initContact, initNav, initActiveLinks, initReveals, initMarquee, initCarousel, initBadges, initClickSound, initReel, initChrome].forEach((init) => {
    try { init(); } catch (err) { console.error(err); }
  });
})();
