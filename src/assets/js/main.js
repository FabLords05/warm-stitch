/* ==========================================================================
   Warm Stitch — Bootstrap & event wiring
   --------------------------------------------------------------------------
   All behaviour is attached here. The HTML carries no inline JavaScript:
   interactive elements declare a `data-action` and this file routes it.
   One delegated listener covers the whole page, including the product cards
   and cart lines that are generated at runtime.
   ========================================================================== */

var WS = window.WS = window.WS || {};

(function () {

  /* ------------------------------------------------------- click routing */

  var actions = {
    /* Product grid */
    'quickview': function (el) { WS.quickview.open(el.getAttribute('data-id')); },
    'size': function (el) { WS.catalog.selectSize(el.getAttribute('data-id'), el.getAttribute('data-size')); },
    'add': function (el) {
      var id = el.getAttribute('data-id');
      WS.cart.add(id, WS.catalog.getSelectedSize(id));
    },
    'filter': function (el) { WS.catalog.setFilter(el.getAttribute('data-filter')); },

    /* Quick view */
    'qv-size': function (el) { WS.quickview.selectSize(el.getAttribute('data-size')); },
    'qv-add': function () { WS.quickview.addCurrentToCart(); },
    'qv-close': function () { WS.quickview.close(); },

    /* Shopping bag */
    'cart-open': function () { WS.cart.toggleDrawer(); },
    'cart-close': function () { WS.cart.closeDrawer(); },
    'qty': function (el) {
      WS.cart.updateQuantity(el.getAttribute('data-cart-id'), parseInt(el.getAttribute('data-delta'), 10));
    },

    /* Checkout */
    'checkout-open': function () { WS.checkout.open(); },
    'checkout-close': function () { WS.checkout.close(); },
    'confirm-close': function () { WS.checkout.closeConfirmation(); },

    /* Navigation */
    'menu-toggle': function () { WS.ui.toggleMobileMenu(); },
    'nav-link': function () { WS.ui.closeMobileMenu(); },
    'clear-search': function () { WS.catalog.setSearch(''); }
  };

  document.addEventListener('click', function (event) {
    /* A click landing directly on a dimmed overlay closes that dialog.
       Clicks inside the panel have a different target, so they pass through. */
    var backdrop = event.target.getAttribute && event.target.getAttribute('data-backdrop');
    if (backdrop) {
      if (backdrop === 'cartModal') { WS.cart.closeDrawer(); }
      else { WS.ui.closeModal(backdrop); }
      return;
    }

    var el = event.target.closest('[data-action]');
    if (!el) return;

    var handler = actions[el.getAttribute('data-action')];
    if (handler) handler(el, event);
  });

  /* ------------------------------------------------------------ keyboard */

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;

    /* Close the top-most layer only. */
    if (WS.ui.isModalOpen('confirmationModal')) { WS.checkout.closeConfirmation(); }
    else if (WS.quickview.isOpen()) { WS.quickview.close(); }
    else if (WS.ui.isModalOpen('checkoutModal')) { WS.checkout.close(); }
    else if (WS.cart.isDrawerOpen()) { WS.cart.closeDrawer(); }
    else { WS.ui.closeMobileMenu(); }
  });

  /* -------------------------------------------------------------- inputs */

  function wireSearch(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function () { WS.catalog.setSearch(el.value); });
    }
  }

  function wireForm(id, handler) {
    var form = document.getElementById(id);
    if (form) form.addEventListener('submit', handler);
  }

  /* ---------------------------------------------------------------- init */

  function init() {
    wireSearch('searchInput');
    wireSearch('mobileSearchInput');
    wireForm('checkoutForm', WS.checkout.placeOrder);
    wireForm('inquiryForm', WS.checkout.handleInquiry);

    /* Keep the free-delivery figure in one place (cart.js) rather than
       repeating it in the markup. */
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-free-delivery]'),
      function (el) { el.textContent = WS.peso(WS.FREE_DELIVERY_THRESHOLD); }
    );

    /* Stamp the current year into the footer. */
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-year]'),
      function (el) { el.textContent = new Date().getFullYear(); }
    );

    WS.cart.load();
    WS.catalog.setFilter('all');   // renders the grid
    WS.cart.render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
