const search = document.querySelector('#catalog-search');
const authorSelect = document.querySelector('#catalog-author');
const formatButtons = Array.from(document.querySelectorAll('[data-format-filter]'));
const cards = Array.from(document.querySelectorAll('.book-card'));
const emptyState = document.querySelector('#catalog-empty');

if (cards.length) {
  let activeFormat = 'all';

  const applyFilters = () => {
    const query = (search?.value || '').trim().toLowerCase();
    const author = authorSelect?.value || '';
    let visible = 0;

    for (const card of cards) {
      const haystack = card.getAttribute('data-search') || '';
      const cardAuthor = card.getAttribute('data-author') || '';
      const cardFormats = (card.getAttribute('data-formats') || '').split(',').filter(Boolean);
      const matchesQuery = !query || haystack.includes(query);
      const matchesAuthor = !author || cardAuthor === author;
      const matchesFormat = activeFormat === 'all' || cardFormats.includes(activeFormat);
      const show = matchesQuery && matchesAuthor && matchesFormat;
      card.hidden = !show;
      if (show) visible += 1;
    }

    if (emptyState) emptyState.hidden = visible !== 0;
  };

  search?.addEventListener('input', applyFilters);
  authorSelect?.addEventListener('change', applyFilters);

  for (const button of formatButtons) {
    button.addEventListener('click', () => {
      activeFormat = button.dataset.formatFilter || 'all';
      for (const other of formatButtons) other.classList.remove('is-active');
      button.classList.add('is-active');
      applyFilters();
    });
  }

  applyFilters();
}
