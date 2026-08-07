/* ============================================================
   MIKI TECH STORE — home page: tabs + product grid
   ============================================================ */

const grid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const tabs = Array.from(document.querySelectorAll(".tab"));
const tabIndicator = document.getElementById("tabIndicator");
const tabsTrack = document.getElementById("tabsTrack");

let activeCategory = "smartphones";

function iconFor(category) {
  const icons = {
    smartphones: '<path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M11 5h2" stroke-linecap="round"/>',
    protectors: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/>',
    covers: '<path d="M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M10 3v2M14 3v2" stroke-linecap="round"/>',
    earphones: '<path d="M4 12v-1a8 8 0 0 1 16 0v1" stroke-linecap="round"/><rect x="2.5" y="12" width="4" height="7" rx="1.5"/><rect x="17.5" y="12" width="4" height="7" rx="1.5"/>'
  };
  return icons[category] || "";
}

function renderProducts(category) {
  const items = PRODUCTS.filter(p => p.category === category);
  grid.classList.remove("product-grid--in");

  window.setTimeout(() => {
    grid.innerHTML = "";

    if (items.length === 0) {
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
      items.forEach((product, i) => {
        const card = document.createElement("article");
        card.className = "card";
        card.style.setProperty("--delay", `${i * 60}ms`);
        card.innerHTML = `
          <div class="card-media">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
          </div>
          <div class="card-body">
            <h3 class="card-title">${product.title}</h3>
            <p class="card-desc">${product.description}</p>
            <div class="card-footer">
              <span class="card-price">${formatPrice(product.price)}</span>
              <button class="btn btn-add" data-id="${product.id}">
                <span class="btn-add-label">Add</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    requestAnimationFrame(() => grid.classList.add("product-grid--in"));
  }, items.length ? 120 : 0);
}

function moveIndicator(tabEl) {
  if (!tabEl) return;
  const trackRect = tabsTrack.getBoundingClientRect();
  const rect = tabEl.getBoundingClientRect();
  tabIndicator.style.width = `${rect.width}px`;
  tabIndicator.style.transform = `translateX(${rect.left - trackRect.left + tabsTrack.scrollLeft}px)`;
}

function setActiveTab(category, tabEl) {
  activeCategory = category;
  tabs.forEach(t => t.classList.toggle("tab--active", t === tabEl));
  tabs.forEach(t => t.setAttribute("aria-current", t === tabEl ? "true" : "false"));
  moveIndicator(tabEl);
  renderProducts(category);
  tabEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => setActiveTab(tab.dataset.cat, tab));
});

grid.addEventListener("click", e => {
  const btn = e.target.closest(".btn-add");
  if (!btn) return;
  const product = findProduct(btn.dataset.id);
  addToCart(product.id, 1);
  bounceCartFab();
  showToast(`Added "${product.title}" to cart`);
  btn.classList.remove("btn-add--pop");
  void btn.offsetWidth;
  btn.classList.add("btn-add--pop");
});

window.addEventListener("resize", () => {
  const activeTab = tabs.find(t => t.classList.contains("tab--active"));
  moveIndicator(activeTab);
});

// Sticky header shrink + tab bar stuck styling
const header = document.getElementById("siteHeader");
const tabsNav = document.getElementById("tabs");
window.addEventListener("scroll", () => {
  header.classList.toggle("site-header--scrolled", window.scrollY > 12);
  const tabsTop = tabsNav.getBoundingClientRect().top;
  tabsNav.classList.toggle("tabs--stuck", tabsTop <= (header.offsetHeight || 0));
}, { passive: true });

// init
const firstTab = tabs.find(t => t.dataset.cat === activeCategory) || tabs[0];
setActiveTab(firstTab.dataset.cat, firstTab);
