/* ============================================================
   MIKI TECH STORE — shared cart storage & helpers
   Cart shape in localStorage: { "<productId>": qty, ... }
   ============================================================ */

const CART_KEY = "miki_cart_v1";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadges();
}

function addToCart(productId, qty = 1, phone = "") {
  const cart = getCart();
  const key = phone ? productId + "::" + encodeURIComponent(phone) : productId;
  cart[key] = (cart[key] || 0) + qty;
  saveCart(cart);
}

function setCartQty(productId, qty) {
  const cart = getCart();
  if (qty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = qty;
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
}

function getCartCount() {
  const cart = getCart();
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

function findProduct(productId) {
  return PRODUCTS.find(p => p.id === productId.split("::")[0]);
}

function getCartLines() {
  const cart = getCart();
  return Object.entries(cart)
    .map(([id, qty]) => {
      const product = findProduct(id);
      if (!product) return null;
      const phone = id.includes("::") ? decodeURIComponent(id.split("::")[1]) : "";
      return { id, product, phone, qty, lineTotal: product.price * qty };
    })
    .filter(Boolean);
}

function getCartTotal() {
  return getCartLines().reduce((sum, line) => sum + line.lineTotal, 0);
}

function formatPrice(amount) {
  return `${CURRENCY} ${amount.toLocaleString("en-KE")}`;
}

function updateCartBadges() {
  const count = getCartCount();
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = count;
    el.classList.toggle("cart-count--hidden", count === 0);
  });
}

function bounceCartFab() {
  document.querySelectorAll(".cart-fab").forEach(el => {
    el.classList.remove("cart-fab--bounce");
    // force reflow so the animation can restart
    void el.offsetWidth;
    el.classList.add("cart-fab--bounce");
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("toast--show");
  void toast.offsetWidth;
  toast.classList.add("toast--show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("toast--show"), 2200);
}

document.addEventListener("DOMContentLoaded", updateCartBadges);
