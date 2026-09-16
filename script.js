// ------------------------------------------------------------
// Page transitions: a black overlay wipes across on the way out
// (growing from a thin line to full coverage) and wipes away on
// the way in (shrinking back to a line, then vanishing).
//
// The overlay itself starts covering the new page BEFORE this
// script even runs — see the small inline script right after
// <body> on every page, which flips it on synchronously (using
// a sessionStorage flag set here on exit) so there's no flash of
// the new page's content before the reveal animation plays.
// ------------------------------------------------------------
(function () {
  const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EXIT_MS = 380;
  const NAV_FLAG = 'pt-nav';

  const overlay = document.getElementById('transition-overlay');
  if (!overlay) return;

  // Arrived via an internal nav click — the inline snippet in <body>
  // already set us to fully covered. Shrink the overlay away.
  if (overlay.classList.contains('is-covering')) {
    try { sessionStorage.removeItem(NAV_FLAG); } catch (err) { /* ignore */ }

    requestAnimationFrame(() => {
      overlay.classList.add('is-revealing');
      overlay.addEventListener('transitionend', () => {
        overlay.classList.remove('is-covering', 'is-revealing');
      }, { once: true });
    });
  }

  // Exit animation when clicking a nav tab to another page.
  document.querySelectorAll('.nav-tab').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('active')) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const href = link.getAttribute('href');
      if (!href || /^https?:\/\//i.test(href)) return;

      if (REDUCE_MOTION) return; // let the normal link navigation happen

      e.preventDefault();

      try { sessionStorage.setItem(NAV_FLAG, '1'); } catch (err) { /* ignore */ }
      overlay.classList.add('is-hiding');

      setTimeout(() => {
        window.location.href = href;
      }, EXIT_MS);
    });
  });
})();

// Picks a random entry on the timeline, scrolls to it, and gives it a
// little pulse so it feels found rather than just jumped to.
const surpriseBtn = document.getElementById('surprise-btn');
const entries = document.querySelectorAll('.entry');

if (surpriseBtn && entries.length) {
  surpriseBtn.addEventListener('click', () => {
    const pick = entries[Math.floor(Math.random() * entries.length)];
    pick.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const card = pick.querySelector('.card');
    card.classList.remove('pulse');
    // restart animation even if the same card gets picked twice in a row
    void card.offsetWidth;
    card.classList.add('pulse');
  });
}

// ------------------------------------------------------------
// Horizontal year nav: click a year pill to jump to the first
// entry from that year, and highlight whichever year is
// currently in view as the person scrolls the timeline by hand.
// ------------------------------------------------------------
const yearPills = document.querySelectorAll('.year-pill');

if (yearPills.length && entries.length) {
  yearPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const year = pill.dataset.year;
      const target = document.querySelector(`.entry[data-year="${year}"]`);
      if (target) {
        // If a tag filter is hiding the entry we're about to jump to,
        // clear it back to "all" first so the jump actually lands somewhere visible.
        if (target.classList.contains('is-hidden')) {
          const allChip = document.querySelector('.filter-chip[data-filter="all"]');
          if (allChip) allChip.click();
        }
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const setActivePill = (year) => {
    yearPills.forEach((pill) => {
      pill.classList.toggle('active', pill.dataset.year === year);
    });
  };

  const observer = new IntersectionObserver(
    (observedEntries) => {
      observedEntries.forEach((observed) => {
        if (observed.isIntersecting) {
          setActivePill(observed.target.dataset.year);
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );

  entries.forEach((entry) => observer.observe(entry));
}

// ------------------------------------------------------------
// Dark mode toggle.
// The actual theme (light/dark) is already applied before first
// paint by the inline script in <head> of every page — this just
// wires up the button to flip it and remember the choice.
// ------------------------------------------------------------
const themeToggle = document.getElementById('theme-toggle');

function setToggleLabel(theme) {
  if (!themeToggle) return;
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

if (themeToggle) {
  setToggleLabel(document.documentElement.getAttribute('data-theme') || 'light');

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (err) { /* ignore */ }
    setToggleLabel(next);
  });
}

// ------------------------------------------------------------
// Timeline tag filter (home page). Click "work" / "life" / "win"
// to show only those entries; click "all" to reset.
// ------------------------------------------------------------
const filterChips = document.querySelectorAll('.filter-chip');

if (filterChips.length && entries.length) {
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.dataset.filter;
      entries.forEach((entry) => {
        const matches = filter === 'all' || entry.dataset.tag === filter;
        entry.classList.toggle('is-hidden', !matches);
      });
    });
  });
}

// ------------------------------------------------------------
// Lightbox: click any .gallery-item (photo) or .video-item to
// open it enlarged, with prev/next through everything else on
// the page, close on Esc/click-outside, and arrow-key navigation.
//
// A photo item needs a <img> inside it — the same src is reused
// in the lightbox. A video item needs either:
//   data-embed="https://www.youtube.com/embed/VIDEO_ID"   (YouTube etc.)
//   data-video="path/to/file.mp4"                          (a local file)
// ------------------------------------------------------------
const lightboxTriggers = document.querySelectorAll('.gallery-item, .video-item');

if (lightboxTriggers.length) {
  const items = Array.from(lightboxTriggers);

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.id = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close">✕</button>
      <button class="lightbox-prev" aria-label="Previous">←</button>
      <div class="lightbox-media-wrap"></div>
      <p class="lightbox-caption"></p>
      <button class="lightbox-next" aria-label="Next">→</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  const mediaWrap = lightbox.querySelector('.lightbox-media-wrap');
  const captionEl = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;

  function captionFor(item) {
    const cap = item.querySelector('.gallery-caption, .video-caption');
    return cap ? cap.textContent.trim() : (item.dataset.caption || '');
  }

  function render(index) {
    const item = items[index];
    if (!item) return;
    currentIndex = index;
    mediaWrap.innerHTML = '';

    if (item.classList.contains('video-item') && (item.dataset.embed || item.dataset.video)) {
      if (item.dataset.embed) {
        const iframe = document.createElement('iframe');
        iframe.className = 'lightbox-media';
        iframe.src = item.dataset.embed;
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        mediaWrap.appendChild(iframe);
      } else {
        const video = document.createElement('video');
        video.className = 'lightbox-media';
        video.src = item.dataset.video;
        video.controls = true;
        video.autoplay = true;
        mediaWrap.appendChild(video);
      }
    } else {
      const sourceImg = item.querySelector('img');
      if (sourceImg) {
        const img = document.createElement('img');
        img.className = 'lightbox-media';
        img.src = sourceImg.src;
        img.alt = sourceImg.alt || '';
        mediaWrap.appendChild(img);
      } else {
        // No real photo/video wired up yet — just show the placeholder text.
        const p = document.createElement('div');
        p.className = 'lightbox-media';
        p.style.padding = '3rem';
        p.style.background = '#211d38';
        p.style.color = '#fff';
        p.textContent = 'Add an <img> or data-embed/data-video to this item to open real media here.';
        mediaWrap.appendChild(p);
      }
    }

    captionEl.textContent = captionFor(item);
  }

  function openAt(index) {
    render(index);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    mediaWrap.innerHTML = ''; // stop any playing video/embed
  }

  function step(delta) {
    const next = (currentIndex + delta + items.length) % items.length;
    render(next);
  }

  items.forEach((item, index) => {
    item.addEventListener('click', () => openAt(index));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openAt(index);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}
