const grid = document.getElementById('productGrid');
const category = document.body.dataset.category || 'smartphones';
const products = PRODUCTS.filter(p => p.category === category);
const types = ['All types', ...new Set(products.map(productType))];
const filters = document.getElementById('typeFilters');
let activeType = 'All types';
const brand = document.getElementById('phoneBrand');
const model = document.getElementById('phoneModel');
function phoneSelection() {
  return [brand?.value, model?.value.trim()].filter(Boolean).join(' ');
}
function renderProducts() {
  const items = products.filter(p => activeType === 'All types' || productType(p) === activeType);
  document.getElementById('productCount').textContent = `${items.length} ${category === 'protectors' ? 'protector types' : 'products'}`;
  document.getElementById('emptyState').hidden = items.length > 0;
  grid.innerHTML = items.map(p => `<article class="card"><div class="card-media">${productArt(p)}</div><div class="card-body"><h2 class="card-title">${escapeHTML(p.title)}</h2><p class="card-desc">${escapeHTML(p.description)}</p><div class="card-footer"><span class="card-price">${formatPrice(p.price)}</span><span class="card-detail">${escapeHTML(productType(p))}</span></div>${category === 'protectors' ? `<p class="fit-note">${phoneSelection() ? 'Requested for ' + escapeHTML(phoneSelection()) : 'Add your phone details above for a fit check.'}</p>` : ''}<button class="btn btn-add" data-id="${escapeHTML(p.id)}" aria-label="Add ${escapeHTML(p.title)} to bag">Add to bag</button></div></article>`).join('');
}
function renderFilters() {
  filters.innerHTML = types.map(type => `<button class="filter-tab" aria-pressed="${type === activeType}" data-type="${escapeHTML(type)}">${escapeHTML(type)}</button>`).join('');
}
filters.addEventListener('click', event => {
  const button = event.target.closest('[data-type]');
  if (!button) return;
  activeType = button.dataset.type;
  renderFilters();
  renderProducts();
});
grid.addEventListener('click', event => {
  const button = event.target.closest('[data-id]');
  if (!button) return;
  const product = findProduct(button.dataset.id);
  addToCart(product.id, 1, category === 'protectors' ? phoneSelection() : '');
  showToast(`${product.title} added to your bag`);
});
function updatePhone() {
  const phone = phoneSelection();
  document.getElementById('finderStatus').textContent = phone ? `Phone requested: ${phone}. We’ll confirm compatibility and availability when you order.` : 'Enter your phone details to include them in your bag. Compatibility is confirmed when ordering.';
  renderProducts();
}
if (brand) {
  brand.addEventListener('change', updatePhone);
  model.addEventListener('input', updatePhone);
  document.getElementById('resetFilters').addEventListener('click', () => {
    brand.value = ''; model.value = ''; activeType = 'All types';
    renderFilters(); updatePhone();
  });
}
renderFilters();
renderProducts();
