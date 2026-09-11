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
