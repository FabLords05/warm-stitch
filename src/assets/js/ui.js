/* ==========================================================================
   Warm Stitch — Shared UI helpers
   Toast notifications, modal open/close, mobile menu, and small formatters
   used by every other module.
   ========================================================================== */

var WS = window.WS = window.WS || {};

/* Format a number as Philippine pesos, e.g. 1850 -> "₱1,850.00" */
WS.peso = function (amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount);
};

/* Escape text before dropping it into generated HTML.
   Product names legitimately contain "&" (e.g. "Aria & Luna Cream Set"),
   so this is not optional. */
WS.escapeHtml = function (text) {
  return String(text).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
};

WS.ui = (function () {
  var toastTimer = null;

  /* Slide-in notification at the bottom of the screen. */
  function toast(message) {
    var el = document.getElementById('toast');
    var msg = document.getElementById('toastMessage');
    if (!el || !msg) return;

    msg.textContent = message;
    el.classList.remove('translate-y-24', 'opacity-0');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.add('translate-y-24', 'opacity-0');
    }, 3000);
  }

  /* Centred modal dialogs (quick view, checkout). */
  function openModal(id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
  }

  function closeModal(id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  function isModalOpen(id) {
    var el = document.getElementById(id);
    return !!el && !el.classList.contains('hidden');
  }

  /* Mobile navigation drawer. */
  function toggleMobileMenu() {
    var menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('hidden');
  }

  function closeMobileMenu() {
    var menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.add('hidden');
  }

  return {
    toast: toast,
    openModal: openModal,
    closeModal: closeModal,
    isModalOpen: isModalOpen,
    toggleMobileMenu: toggleMobileMenu,
    closeMobileMenu: closeMobileMenu
  };
})();
