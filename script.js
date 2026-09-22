/**
 * script.js - JoyChips Landing Page
 *
 * Antislop Mode 1: Rules applied during development.
 * R-26: Every interactive element has real behavior.
 * R-32: Mobile menu supports Escape key and overlay click.
 *
 * KONFIGURASI - Ubah nilai berikut sebelum website live:
 */

const CONFIG = {
  // Ganti dengan nomor WhatsApp JoyChips (format internasional, tanpa tanda +)
  WA_NUMBER: '6281229015842',

  // Pesan default saat tidak ada produk spesifik dipilih
  WA_DEFAULT_MSG: 'Halo JoyChips, saya mau pesan!',
  
  // Harga produk
  PRICE: 19000
};

// CART STATE
let cart = [];

// WA LINK GENERATOR

function buildWaLink(msg) {
  return 'https://wa.me/' + CONFIG.WA_NUMBER + '?text=' + encodeURIComponent(msg);
}

function buildOrderMsg(product, variant) {
  return 'Halo JoyChips, saya mau pesan ' + product + ' varian ' + variant;
}

function buildCartMsg() {
  let msg = 'Halo JoyChips!\n\nSaya mau pesan:\n';
  cart.forEach(function(item) {
    msg += '• ' + item.qty + 'x ' + item.product + ' - ' + item.variant + '\n';
  });
  let total = cart.reduce(function(sum, item) { return sum + (item.qty * CONFIG.PRICE); }, 0);
  msg += '\nTotal: Rp ' + total.toLocaleString('id-ID') + '\n\n';
  msg += 'Apakah stoknya tersedia? Kalau ada, gimana cara pengiriman/ambilnya?\n\nTerima kasih!';
  return msg;
}

// CART FUNCTIONS

function addToCart(product, variant, qty) {
  let existing = cart.find(function(item) {
    return item.product === product && item.variant === variant;
  });
  
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ product: product, variant: variant, qty: qty });
  }
  
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  let cartSummary = document.getElementById('cart-summary');
  let cartItems = document.getElementById('cart-items');
  let cartTotal = document.getElementById('cart-total');
  
  if (cart.length === 0) {
    cartSummary.hidden = true;
    return;
  }
  
  cartSummary.hidden = false;
  cartItems.innerHTML = '';
  
  cart.forEach(function(item, index) {
    let itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = 
      '<span class="cart-item__name">' + item.product + ' - ' + item.variant + '</span>' +
      '<span class="cart-item__qty">x' + item.qty + '</span>' +
      '<span class="cart-item__price">Rp ' + (item.qty * CONFIG.PRICE).toLocaleString('id-ID') + '</span>' +
      '<button class="cart-item__remove" data-index="' + index + '" aria-label="Hapus item">×</button>';
    cartItems.appendChild(itemEl);
  });
  
  document.querySelectorAll('.cart-item__remove').forEach(function(btn) {
    btn.addEventListener('click', function() {
      removeFromCart(parseInt(this.dataset.index));
    });
  });
  
  let total = cart.reduce(function(sum, item) { return sum + (item.qty * CONFIG.PRICE); }, 0);
  cartTotal.textContent = 'Rp ' + total.toLocaleString('id-ID');
}

// QUANTITY CONTROLS

function setupQuantityControls() {
  document.querySelectorAll('.qty-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      let product = this.dataset.product;
      let input = document.getElementById('qty-' + product);
      let currentVal = parseInt(input.value);
      
      if (this.classList.contains('qty-btn--minus')) {
        if (currentVal > 1) input.value = currentVal - 1;
      } else {
        if (currentVal < 99) input.value = currentVal + 1;
      }
    });
  });
  
  document.querySelectorAll('.qty-input').forEach(function(input) {
    input.addEventListener('input', function() {
      let val = parseInt(this.value);
      if (isNaN(val) || val < 1) this.value = 1;
      if (val > 99) this.value = 99;
    });
  });
}

// ADD TO CART BUTTONS

function setupAddToCartButtons() {
  document.getElementById('pisang-add-btn').addEventListener('click', function() {
    let activeVariant = document.querySelector('#card-pisang .variant-btn--active');
    let qty = parseInt(document.getElementById('qty-pisang').value);
    addToCart('Keripik Pisang', activeVariant.dataset.variant, qty);
    document.getElementById('qty-pisang').value = 1;
  });
  
  document.getElementById('apel-add-btn').addEventListener('click', function() {
    let activeVariant = document.querySelector('#card-apel .variant-btn--active');
    let qty = parseInt(document.getElementById('qty-apel').value);
    addToCart('Keripik Apel', activeVariant.dataset.variant, qty);
    document.getElementById('qty-apel').value = 1;
  });
}

// CHECKOUT

function setupCheckout() {
  document.getElementById('checkout-btn').addEventListener('click', function() {
    if (cart.length > 0) {
      window.open(buildWaLink(buildCartMsg()), '_blank');
      // Clear cart after checkout
      cart = [];
      updateCartUI();
    }
  });
}

// UPDATE SEMUA WA LINKS

function updateAllWaLinks() {
  var defaultLink = buildWaLink(CONFIG.WA_DEFAULT_MSG);
  var linkIds = ['nav-wa-link','hero-wa-link','contact-wa-link','drawer-wa-link','footer-wa-link','float-wa-btn'];
  linkIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.href = defaultLink;
  });
}

// VARIANT SELECTOR

function setupVariantSelectors() {
  var variantBtns = document.querySelectorAll('.variant-btn');
  variantBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var card = this.closest('.produk-card');
      card.querySelectorAll('.variant-btn').forEach(function(b) {
        b.classList.remove('variant-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('variant-btn--active');
      this.setAttribute('aria-pressed', 'true');
    });
  });
}

// MOBILE MENU

function setupMobileMenu() {
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var drawer = document.getElementById('mobile-drawer');
  var overlay = document.getElementById('mobile-overlay');
  var closeBtn = document.getElementById('drawer-close');
  if (!hamburgerBtn || !drawer) return;

  function openDrawer() {
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('mobile-overlay--visible');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.classList.add('nav__hamburger--open');
    document.body.classList.add('menu-open');
    setTimeout(function() { if (closeBtn) closeBtn.focus(); }, 60);
  }

  function closeDrawer() {
    drawer.hidden = true;
    drawer.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('mobile-overlay--visible');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.classList.remove('nav__hamburger--open');
    document.body.classList.remove('menu-open');
    hamburgerBtn.focus();
  }

  hamburgerBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer && !drawer.hidden) closeDrawer();
  });
  document.querySelectorAll('.mobile-drawer__link, .mobile-drawer__cta').forEach(function(link) {
    link.addEventListener('click', closeDrawer);
  });
}

// STICKY NAV

function setupStickyNav() {
  var header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', function() {
    header.classList.toggle('site-header--scrolled', window.scrollY > 24);
  }, { passive: true });
}

// SMOOTH SCROLL

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = document.getElementById('site-header') ? document.getElementById('site-header').offsetHeight : 0;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerHeight, behavior: 'smooth' });
      }
    });
  });
}

// SCROLL REVEAL

function setupScrollReveal() {
  var targets = document.querySelectorAll('.produk-card, .feature-card, .contact-card, .order-step, .reveal-on-scroll');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function(el) { el.classList.add('in-view'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(function(el) { observer.observe(el); });
}

// ACTIVE NAV LINK

function setupActiveNav() {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__link');
  window.addEventListener('scroll', function() {
    var scrollY = window.scrollY + 120;
    sections.forEach(function(section) {
      var id = section.getAttribute('id');
      navLinks.forEach(function(link) {
        if (link.getAttribute('href') === '#' + id) {
          var active = scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight;
          link.classList.toggle('nav__link--active', active);
        }
      });
    });
  }, { passive: true });
}

// INIT

document.addEventListener('DOMContentLoaded', function() {
  updateAllWaLinks();
  setupVariantSelectors();
  setupQuantityControls();
  setupAddToCartButtons();
  setupCheckout();
  setupMobileMenu();
  setupStickyNav();
  setupSmoothScroll();
  setupScrollReveal();
  setupActiveNav();
});
