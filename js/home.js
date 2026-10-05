const grid = document.getElementById('productGrid');
const category = document.body.dataset.category || 'smartphones';
const products = PRODUCTS.filter(p => p.category === category);
const allFilter = category === 'protectors' ? 'All brands' : 'All types';
const types = category === 'protectors'
  ? ['All brands', 'Samsung', 'Tecno', 'Redmi', 'Apple', 'Infinix', 'Other']
  : category === 'smartphones'
  ? ['All types', 'Samsung', 'Tecno', 'Redmi']
  : ['All types', ...new Set(products.map(productType))];
function phoneBrand(product) {
  return product.brand || ['Samsung', 'Tecno', 'Redmi'].find(name =>
    product.title.toLowerCase().includes(name.toLowerCase())) || '';
}
const filters = document.getElementById('typeFilters');
let activeType = allFilter;
const brand = document.getElementById('phoneBrand');
const model = document.getElementById('phoneModel');
function phoneSelection() {
  return [brand?.value, model?.value.trim()].filter(Boolean).join(' ');
}
function renderProducts() {
  const items = products.filter(p => {
    if (activeType === allFilter) return true;
    if (category === 'protectors') {
      const brands = p.compatibleBrands || (p.brand ? [p.brand] : []);
      return brands.some(name => name.toLowerCase() === activeType.toLowerCase());
    }
    return category === 'smartphones'
      ? phoneBrand(p).toLowerCase() === activeType.toLowerCase()
      : productType(p) === activeType;
  });
  document.getElementById('productCount').textContent = `${items.length} ${category === 'protectors' ? 'protectors' : 'products'}`;
  document.getElementById('emptyState').hidden = items.length > 0;
  grid.innerHTML = items.map(p => `<article class="card"><div class="card-media">${productArt(p)}</div><div class="card-body"><h2 class="card-title">${escapeHTML(p.title)}</h2><p class="card-desc">${escapeHTML(p.description)}</p><div class="card-footer"><span class="card-price">${formatPrice(p.price)}</span><span class="card-detail">${escapeHTML(productType(p))}</span></div>${category === 'protectors' ? `<p class="fit-note">${phoneSelection() ? 'Requested for ' + escapeHTML(phoneSelection()) : 'Phone fit confirmed when ordering.'}</p>` : ''}<button class="btn btn-add" data-id="${escapeHTML(p.id)}" aria-label="Add ${escapeHTML(p.title)} to bag">Add to bag</button></div></article>`).join('');
}
function renderFilters() {
  filters.innerHTML = types.map(type => `<button class="filter-tab" aria-pressed="${type === activeType}" data-type="${escapeHTML(type)}">${escapeHTML(type)}</button>`).join('');
}
filters.addEventListener('click', event => {
  const button = event.target.closest('[data-type]');
  if (!button) return;
  activeType = button.dataset.type;
  if (category === 'protectors' && brand) {
    brand.value = activeType === allFilter ? '' : activeType;
    renderFilters();
    updatePhone();
  } else {
    renderFilters();
    renderProducts();
  }
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
  brand.addEventListener('change', () => {
    activeType = brand.value || allFilter;
    renderFilters();
    updatePhone();
  });
  model.addEventListener('input', updatePhone);
  document.getElementById('resetFilters').addEventListener('click', () => {
    brand.value = ''; model.value = ''; activeType = allFilter;
    renderFilters(); updatePhone();
  });
}
renderFilters();
renderProducts();
