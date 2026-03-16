const search = document.querySelector('#catalog-search');
if (search) {
  const cards = Array.from(document.querySelectorAll('.book-card'));
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    for (const card of cards) {
      const haystack = card.getAttribute('data-search') || '';
      card.style.display = !query || haystack.includes(query) ? '' : 'none';
    }
  });
}
