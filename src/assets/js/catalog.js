/* ==========================================================================
   Warm Stitch — Product Catalog Grid
   Renders the product cards, handles the category filters, the search box,
   and the per-card size selector that drives the live price.
   ========================================================================== */

var WS = window.WS = window.WS || {};

WS.catalog = (function () {
  /* Which filter button is active. 'all' plus one per gender and per type. */
  var activeFilter = 'all';
  var searchQuery = '';

  /* Remembers the size chosen on each card, so the price stays put between
     re-renders. Defaults to M. */
  var selectedSizes = {};

  var FILTERS = ['all', 'women', 'men', 'top', 'bottom', 'set'];

  function sizeFor(product) {
    return selectedSizes[product.id] || 'M';
  }

  function matchesFilter(product) {
    if (activeFilter === 'all') return true;
    return product.gender === activeFilter || product.type === activeFilter;
  }

  function matchesSearch(product) {
    if (!searchQuery) return true;
    var q = searchQuery.toLowerCase();
    return product.name.toLowerCase().indexOf(q) !== -1 ||
           product.description.toLowerCase().indexOf(q) !== -1;
  }

  /* The tile shown for products whose photo hasn't been supplied yet.
     Same aspect ratio as a real photo so the grid stays even. */
  function placeholderHtml(product) {
    return '' +
      '<div class="w-full h-full bg-brand-100 flex flex-col items-center justify-center text-center px-5 gap-3">' +
        '<span class="serif text-3xl font-bold text-brand-400 tracking-widest">WS</span>' +
        '<span class="serif text-sm font-semibold text-brand-700 leading-snug">' + WS.escapeHtml(product.name) + '</span>' +
        '<span class="text-[10px] uppercase tracking-widest text-brand-600">Photo coming soon</span>' +
      '</div>';
  }

  function cardHtml(product) {
    var size = sizeFor(product);
    var name = WS.escapeHtml(product.name);

    var media = product.image
      ? '<img src="' + product.image + '" alt="' + name + '" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">'
      : placeholderHtml(product);

    var sizeButtons = WS.SIZES.map(function (sz) {
      var on = sz === size;
      return '<button type="button" data-action="size" data-id="' + product.id + '" data-size="' + sz + '" ' +
             'aria-pressed="' + on + '" ' +
             'class="w-9 h-8 rounded-lg text-[11px] font-bold border transition ' +
             (on ? 'bg-brand-600 text-white border-brand-600'
                 : 'bg-white text-brand-700 border-brand-300 hover:border-brand-500') + '">' + sz + '</button>';
    }).join('');

    return '' +
      '<article class="product-card bg-white border border-brand-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg flex flex-col group">' +
        /* Clicking the photo opens the quick-view popup */
        '<button type="button" data-action="quickview" data-id="' + product.id + '" ' +
                'aria-label="Quick view: ' + name + '" ' +
                'class="relative aspect-[3/4] bg-brand-100 overflow-hidden block w-full text-left cursor-zoom-in">' +
          media +
          '<span class="absolute top-3 left-3 bg-white/90 backdrop-blur text-brand-700 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-brand-200">' +
            product.gender + ' &middot; ' + product.type +
          '</span>' +
          '<span class="absolute bottom-3 right-3 bg-brand-900/80 text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">' +
            '<i class="fa-solid fa-expand mr-1"></i>Quick view' +
          '</span>' +
        '</button>' +

        '<div class="p-5 flex flex-col flex-grow gap-3">' +
          '<div class="flex items-start justify-between gap-3">' +
            '<h3 class="serif text-base font-bold text-brand-900 leading-snug">' + name + '</h3>' +
            /* Live price — re-rendered whenever the size changes */
            '<span data-price-for="' + product.id + '" class="serif text-base font-bold text-brand-600 whitespace-nowrap">' +
              WS.peso(product.prices[size]) +
            '</span>' +
          '</div>' +

          '<p class="text-brand-700 text-xs leading-relaxed clamp-3">' + WS.escapeHtml(product.description) + '</p>' +

          '<div class="pt-3 mt-auto border-t border-brand-200 space-y-3">' +
            '<div class="flex items-center justify-between gap-2">' +
              '<span class="text-[11px] uppercase tracking-wider text-brand-600 font-semibold">Size</span>' +
              '<div class="flex gap-1.5">' + sizeButtons + '</div>' +
            '</div>' +
            '<button type="button" data-action="add" data-id="' + product.id + '" ' +
                    'class="w-full py-3 bg-brand-900 hover:bg-brand-600 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider">' +
              '<i class="fa-solid fa-bag-shopping text-xs"></i>' +
              '<span>Add to bag &middot; ' + size + '</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function render() {
    var grid = document.getElementById('productGrid');
    var noResults = document.getElementById('noResults');
    var countEl = document.getElementById('resultCount');
    if (!grid) return;

    var matches = WS.products.filter(function (p) {
      return matchesFilter(p) && matchesSearch(p);
    });

    if (countEl) {
      countEl.textContent = matches.length === 1
        ? '1 item'
        : matches.length + ' items';
    }

    grid.innerHTML = matches.map(cardHtml).join('');
    if (noResults) noResults.classList.toggle('hidden', matches.length > 0);
  }

  /* Picking a size re-renders the card, which is what makes the displayed
     price follow the size. */
  function selectSize(productId, size) {
    selectedSizes[productId] = size;
    render();
  }

  function getSelectedSize(productId) {
    return selectedSizes[productId] || 'M';
  }

  function setFilter(filter) {
    if (FILTERS.indexOf(filter) === -1) filter = 'all';
    activeFilter = filter;

    FILTERS.forEach(function (f) {
      var btn = document.getElementById('btn-' + f);
      if (!btn) return;
      var on = f === filter;
      btn.classList.toggle('bg-brand-900', on);
      btn.classList.toggle('text-white', on);
      btn.classList.toggle('border-brand-900', on);
      btn.classList.toggle('bg-white', !on);
      btn.classList.toggle('text-brand-700', !on);
      btn.classList.toggle('border-brand-300', !on);
      btn.setAttribute('aria-pressed', on);
    });

    render();
  }

  function setSearch(query) {
    searchQuery = (query || '').trim();
    /* Keep the two search boxes (desktop + mobile) showing the same thing. */
    ['searchInput', 'mobileSearchInput'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.value !== searchQuery) el.value = searchQuery;
    });
    render();
  }

  return {
    render: render,
    selectSize: selectSize,
    getSelectedSize: getSelectedSize,
    setFilter: setFilter,
    setSearch: setSearch,
    FILTERS: FILTERS
  };
})();
