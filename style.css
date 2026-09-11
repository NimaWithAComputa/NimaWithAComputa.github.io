// ------------------------------------------------------------
// Page transitions: pan-and-stretch between tabs.
// Direction is based on left-to-right tab order, so clicking a
// tab further right pans/stretches left, and clicking one further
// left pans/stretches right — like the page is being pulled off
// in the direction you came from.
// ------------------------------------------------------------
(function () {
  const PAGE_ORDER = ['index.html', 'career.html', 'personal.html', 'contact.html'];
  const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EXIT_MS = 380;

  const pageEl = document.querySelector('.page');
  if (!pageEl) return;

  function fileName(pathname) {
    const parts = pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1];
    return last && last.length ? last : 'index.html';
  }

  function pageIndex(name) {
    const i = PAGE_ORDER.indexOf(name);
    return i === -1 ? 0 : i;
  }

  // Entrance animation, based on where the visitor came from.
  if (!REDUCE_MOTION && document.referrer) {
    try {
      const refUrl = new URL(document.referrer);
      if (refUrl.origin === window.location.origin) {
        const fromIndex = pageIndex(fileName(refUrl.pathname));
        const toIndex = pageIndex(fileName(window.location.pathname));
        if (fromIndex !== toIndex) {
          pageEl.classList.add(toIndex > fromIndex ? 'page-anim-in-right' : 'page-anim-in-left');
        }
      }
    } catch (err) {
      // malformed or unavailable referrer — just skip the entrance animation
    }
  }

  // Exit animation when clicking a nav tab to another page.
  document.querySelectorAll('.nav-tab').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('active')) return;

      const href = link.getAttribute('href');
      if (!href || /^https?:\/\//i.test(href)) return;

      e.preventDefault();

      if (REDUCE_MOTION) {
        window.location.href = href;
        return;
      }

      const fromIndex = pageIndex(fileName(window.location.pathname));
      const toIndex = pageIndex(fileName(href));
      pageEl.classList.add(toIndex > fromIndex ? 'page-anim-out-left' : 'page-anim-out-right');

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
