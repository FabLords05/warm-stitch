/* ==========================================================================
   Warm Stitch — Checkout (demonstration only)
   --------------------------------------------------------------------------
   NO REAL PAYMENT IS PROCESSED. Submitting the form validates the details,
   shows an order reference and clears the bag. Nothing is sent anywhere and
   no card details are collected.
   ========================================================================== */

var WS = window.WS = window.WS || {};

WS.checkout = (function () {

  function open() {
    if (WS.cart.count() === 0) {
      WS.ui.toast('Your shopping bag is empty.');
      return;
    }
    WS.cart.closeDrawer();

    var totalEl = document.getElementById('checkoutTotalAmount');
    if (totalEl) totalEl.textContent = WS.peso(WS.cart.subtotal());

    var itemsEl = document.getElementById('checkoutItemCount');
    if (itemsEl) {
      var n = WS.cart.count();
      itemsEl.textContent = n === 1 ? '1 item' : n + ' items';
    }

    WS.ui.openModal('checkoutModal');
  }

  function close() {
    WS.ui.closeModal('checkoutModal');
  }

  function orderReference() {
    var n = Math.floor(Math.random() * 90000) + 10000;
    return 'WS-' + new Date().getFullYear() + '-' + n;
  }

  function placeOrder(event) {
    event.preventDefault();

    var method = document.getElementById('paymentMethodSelect');
    var methodLabel = method ? method.options[method.selectedIndex].text : 'your selected method';
    var reference = orderReference();
    var total = WS.cart.subtotal();

    close();
    event.target.reset();
    WS.cart.clear();

    /* Confirmation panel standing in for a real order-success page. */
    setText('confirmReference', reference);
    setText('confirmTotal', WS.peso(total));
    setText('confirmMethod', methodLabel);
    WS.ui.openModal('confirmationModal');
  }

  function closeConfirmation() {
    WS.ui.closeModal('confirmationModal');
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function handleInquiry(event) {
    event.preventDefault();
    event.target.reset();
    WS.ui.toast('Thank you — your inquiry has been sent to warmstitch.clothing@gmail.com');
  }

  return {
    open: open,
    close: close,
    placeOrder: placeOrder,
    closeConfirmation: closeConfirmation,
    handleInquiry: handleInquiry
  };
})();
