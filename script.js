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
