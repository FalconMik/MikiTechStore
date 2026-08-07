/* ============================================================
   MIKI TECH STORE — cart page rendering + WhatsApp checkout
   ============================================================ */

const cartList = document.getElementById("cartList");
const cartEmpty = document.getElementById("cartEmpty");
const cartSummary = document.getElementById("cartSummary");
const summaryCount = document.getElementById("summaryCount");
const summaryTotal = document.getElementById("summaryTotal");
const orderBtn = document.getElementById("orderBtn");

function renderCart() {
  const lines = getCartLines();

  if (lines.length === 0) {
    cartList.innerHTML = "";
    cartEmpty.hidden = false;
    cartSummary.hidden = true;
    return;
  }

  cartEmpty.hidden = true;
  cartSummary.hidden = false;

  cartList.innerHTML = lines.map((line, i) => `
    <div class="cart-item" style="--delay:${i * 60}ms" data-id="${line.product.id}">
      <div class="cart-item-media">
        <img src="${line.product.image}" alt="${line.product.title}">
      </div>
      <div class="cart-item-body">
        <h3 class="cart-item-title">${line.product.title}</h3>
        <span class="cart-item-price">${formatPrice(line.product.price)} each</span>
        <div class="qty-stepper">
          <button class="qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>
          <span class="qty-value">${line.qty}</span>
          <button class="qty-btn" data-action="inc" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-total">${formatPrice(line.lineTotal)}</span>
        <button class="remove-btn" data-action="remove" aria-label="Remove item">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  `).join("");

  requestAnimationFrame(() => {
    cartList.querySelectorAll(".cart-item").forEach(el => el.classList.add("cart-item--in"));
  });

  const count = lines.reduce((s, l) => s + l.qty, 0);
  summaryCount.textContent = count;
  summaryTotal.textContent = formatPrice(getCartTotal());
}

cartList.addEventListener("click", e => {
  const itemEl = e.target.closest(".cart-item");
  if (!itemEl) return;
  const id = itemEl.dataset.id;
  const cart = getCart();
  const currentQty = cart[id] || 0;

  if (e.target.closest('[data-action="inc"]')) {
    setCartQty(id, currentQty + 1);
    renderCart();
  } else if (e.target.closest('[data-action="dec"]')) {
    setCartQty(id, currentQty - 1);
    renderCart();
  } else if (e.target.closest('[data-action="remove"]')) {
    itemEl.classList.add("cart-item--removing");
    setTimeout(() => {
      removeFromCart(id);
      renderCart();
    }, 220);
  }
});

function buildWhatsAppMessage() {
  const lines = getCartLines();
  const header = "Hi Miki Tech Store! I'd like to order:";
  const itemLines = lines.map(
    (l, i) => `${i + 1}. ${l.product.title} x${l.qty} — ${formatPrice(l.lineTotal)}`
  );
  const total = `\nTotal: ${formatPrice(getCartTotal())}`;
  return [header, "", ...itemLines, total].join("\n");
}

orderBtn.addEventListener("click", () => {
  const lines = getCartLines();
  if (lines.length === 0) return;
  const message = encodeURIComponent(buildWhatsAppMessage());
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, "_blank", "noopener");
});

renderCart();
