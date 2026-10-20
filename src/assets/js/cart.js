/* ==========================================================================
   Warm Stitch — Shopping Bag
   --------------------------------------------------------------------------
   Cart state, localStorage persistence, and the slide-out bag drawer.

   IMPORTANT: a line item stores its own `unitPrice`, captured at the moment
   it was added. The same product in two sizes costs two different amounts,
   so a cart total can never be computed from a single "product price".
   ========================================================================== */

var WS = window.WS = window.WS || {};

/* Orders above this amount ship free (shown in Payment & Delivery). */
WS.FREE_DELIVERY_THRESHOLD = 9426.08;

WS.cart = (function () {
  var STORAGE_KEY = 'warmstitch.cart.v1';
  var items = [];

  /* ---------------------------------------------------------- persistence */

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      /* Private browsing or blocked storage — the cart still works for this
         visit, it just won't survive a refresh. Not worth interrupting for. */
    }
  }

  function load() {
    var raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return;
    }
    if (!raw) return;

    var saved;
    try {
      saved = JSON.parse(raw);
    } catch (e) {
      return;
    }
    if (!Array.isArray(saved)) return;

    /* Re-resolve every saved line against the current catalog. If prices were
       edited in products.js since the cart was saved, the shopper sees today's
       price; if a product was removed entirely, the line is dropped. */
    items = saved.reduce(function (acc, line) {
      var product = WS.products.find(function (p) { return p.id === line.productId; });
      if (!product) return acc;
      var price = product.prices[line.size];
      if (typeof price !== 'number') return acc;

      acc.push({
        cartItemId: product.id + '-' + line.size,
        productId: product.id,
        name: product.name,
        image: product.image,
        size: line.size,
        unitPrice: price,
        quantity: Math.max(1, parseInt(line.quantity, 10) || 1)
      });
      return acc;
    }, []);
  }

  /* --------------------------------------------------------------- totals */

  function count() {
    return items.reduce(function (sum, i) { return sum + i.quantity; }, 0);
  }

  function subtotal() {
    return items.reduce(function (sum, i) { return sum + i.unitPrice * i.quantity; }, 0);
  }

  /* --------------------------------------------------------------- actions */

  function add(productId, size) {
    var product = WS.products.find(function (p) { return p.id === productId; });
    if (!product) return;

    var unitPrice = product.prices[size];
    if (typeof unitPrice !== 'number') return;

    var cartItemId = productId + '-' + size;
    var existing = items.find(function (i) { return i.cartItemId === cartItemId; });

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({
        cartItemId: cartItemId,
        productId: product.id,
        name: product.name,
        image: product.image,
        size: size,
        unitPrice: unitPrice,   // captured now — see note at top of file
        quantity: 1
      });
    }

    save();
    render();
    WS.ui.toast('Added ' + product.name + ' (' + size + ') to your bag');
  }

  function updateQuantity(cartItemId, delta) {
    var item = items.find(function (i) { return i.cartItemId === cartItemId; });
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      items = items.filter(function (i) { return i.cartItemId !== cartItemId; });
    }

    save();
    render();
  }

  function clear() {
    items = [];
    save();
    render();
  }

  /* ------------------------------------------------------------- rendering */

  function lineHtml(item) {
    var name = WS.escapeHtml(item.name);
    var thumb = item.image
      ? '<img src="' + item.image + '" alt="' + name + '" class="w-16 h-20 object-cover rounded-lg bg-brand-100">'
      : '<div class="w-16 h-20 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 serif text-xs font-bold">WS</div>';

    return '' +
      '<div class="flex items-center gap-4 bg-white p-3 rounded-xl border border-brand-200">' +
        thumb +
        '<div class="flex-grow min-w-0">' +
          '<h4 class="serif text-xs font-bold text-brand-900 truncate">' + name + '</h4>' +
          '<p class="text-[11px] text-brand-600 mt-0.5">Size <span class="font-semibold text-brand-800">' + item.size + '</span> &middot; ' + WS.peso(item.unitPrice) + '</p>' +
          '<div class="flex items-center gap-3 mt-2">' +
            '<button type="button" data-action="qty" data-cart-id="' + item.cartItemId + '" data-delta="-1" aria-label="Decrease quantity" class="w-6 h-6 rounded bg-brand-100 hover:bg-brand-200 text-brand-800 flex items-center justify-center text-sm leading-none">&minus;</button>' +
            '<span class="text-xs text-brand-900 font-semibold w-4 text-center">' + item.quantity + '</span>' +
            '<button type="button" data-action="qty" data-cart-id="' + item.cartItemId + '" data-delta="1" aria-label="Increase quantity" class="w-6 h-6 rounded bg-brand-100 hover:bg-brand-200 text-brand-800 flex items-center justify-center text-sm leading-none">+</button>' +
          '</div>' +
        '</div>' +
        '<span class="text-xs font-semibold text-brand-900 whitespace-nowrap">' + WS.peso(item.unitPrice * item.quantity) + '</span>' +
      '</div>';
  }

  function render() {
    var badge = document.getElementById('cartBadge');
    var list = document.getElementById('cartItemsList');
    var subtotalEl = document.getElementById('cartSubtotal');
    var shippingNote = document.getElementById('cartShippingNote');

    var total = subtotal();
    var n = count();

    if (badge) {
      badge.textContent = n;
      badge.classList.toggle('hidden', n === 0);
    }

    if (list) {
      list.innerHTML = items.length === 0
        ? '<div class="text-center py-16 text-brand-600 space-y-3">' +
            '<i class="fa-solid fa-bag-shopping text-4xl"></i>' +
            '<p class="text-sm">Your shopping bag is currently empty.</p>' +
          '</div>'
        : items.map(lineHtml).join('');
    }

    if (subtotalEl) subtotalEl.textContent = WS.peso(total);

    if (shippingNote) {
      if (items.length === 0) {
        shippingNote.textContent = 'Shipping and taxes are calculated at checkout.';
      } else if (total >= WS.FREE_DELIVERY_THRESHOLD) {
        shippingNote.textContent = 'Your order qualifies for free nationwide delivery.';
      } else {
        shippingNote.textContent = 'Add ' + WS.peso(WS.FREE_DELIVERY_THRESHOLD - total) + ' more to qualify for free delivery.';
      }
    }
  }

  /* ---------------------------------------------------------- bag drawer */

  function openDrawer() {
    var modal = document.getElementById('cartModal');
    var panel = document.getElementById('cartContent');
    if (!modal || !panel) return;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    panel.classList.remove('translate-x-full');
    document.body.classList.add('overflow-hidden');
  }

  function closeDrawer() {
    var modal = document.getElementById('cartModal');
    var panel = document.getElementById('cartContent');
    if (!modal || !panel) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    panel.classList.add('translate-x-full');
    document.body.classList.remove('overflow-hidden');
  }

  function isDrawerOpen() {
    var modal = document.getElementById('cartModal');
    return !!modal && !modal.classList.contains('pointer-events-none');
  }

  function toggleDrawer() {
    if (isDrawerOpen()) { closeDrawer(); } else { openDrawer(); }
  }

  return {
    load: load,
    add: add,
    updateQuantity: updateQuantity,
    clear: clear,
    count: count,
    subtotal: subtotal,
    render: render,
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    toggleDrawer: toggleDrawer,
    isDrawerOpen: isDrawerOpen,
    getItems: function () { return items.slice(); }
  };
})();
