/* ==========================================================================
   Warm Stitch — Quick View
   Clicking a product photo opens this popup: the image at full size, the
   complete description, size buttons with a live price, and Add to Bag.
   The size chosen here and the size chosen on the card stay in sync.
   ========================================================================== */

var WS = window.WS = window.WS || {};

WS.quickview = (function () {
  var currentId = null;

  function product() {
    return WS.products.find(function (p) { return p.id === currentId; });
  }

  function paint() {
    var p = product();
    if (!p) return;

    var size = WS.catalog.getSelectedSize(p.id);
    var name = WS.escapeHtml(p.name);

    var media = document.getElementById('qvMedia');
    if (media) {
      media.innerHTML = p.image
        ? '<img src="' + p.image + '" alt="' + name + '" class="w-full h-full object-cover">'
        : '<div class="w-full h-full bg-brand-100 flex flex-col items-center justify-center text-center px-6 gap-3">' +
            '<span class="serif text-5xl font-bold text-brand-400 tracking-widest">WS</span>' +
            '<span class="serif text-base font-semibold text-brand-700">' + name + '</span>' +
            '<span class="text-[10px] uppercase tracking-widest text-brand-600">Photo coming soon</span>' +
          '</div>';
    }

    setText('qvName', p.name);
    setText('qvCategory', p.gender + ' · ' + p.type);
    setText('qvDescription', p.description);
    setText('qvPrice', WS.peso(p.prices[size]));

    var sizes = document.getElementById('qvSizes');
    if (sizes) {
      sizes.innerHTML = WS.SIZES.map(function (sz) {
        var on = sz === size;
        return '<button type="button" data-action="qv-size" data-size="' + sz + '" ' +
               'aria-pressed="' + on + '" ' +
               'class="px-4 py-2 rounded-lg text-xs font-bold border transition ' +
               (on ? 'bg-brand-900 text-white border-brand-900'
                   : 'bg-white text-brand-700 border-brand-300 hover:border-brand-500') + '">' +
               sz + ' &middot; ' + WS.peso(p.prices[sz]) +
               '</button>';
      }).join('');
    }

    var addBtn = document.getElementById('qvAdd');
    if (addBtn) addBtn.textContent = 'Add to bag · ' + size;
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function open(productId) {
    currentId = productId;
    paint();
    WS.ui.openModal('quickViewModal');
  }

  function close() {
    WS.ui.closeModal('quickViewModal');
    currentId = null;
  }

  /* Changing the size here also updates the card behind the popup. */
  function selectSize(size) {
    if (!currentId) return;
    WS.catalog.selectSize(currentId, size);
    paint();
  }

  function addCurrentToCart() {
    if (!currentId) return;
    WS.cart.add(currentId, WS.catalog.getSelectedSize(currentId));
    close();
  }

  return {
    open: open,
    close: close,
    selectSize: selectSize,
    addCurrentToCart: addCurrentToCart,
    isOpen: function () { return WS.ui.isModalOpen('quickViewModal'); }
  };
})();
