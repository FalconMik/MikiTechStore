const brandFilters = document.getElementById('typeFilters');
const modelSection = document.getElementById('modelSection');
const modelButtons = document.getElementById('modelButtons');
const modelStatus = document.getElementById('modelStatus');
const finishFilters = document.getElementById('finishFilters');
const protectorGrid = document.getElementById('productGrid');
let selectedBrand = 'All brands';
let selectedModel = '';
let selectedFinish = 'All finishes';
function coverBrands() {
  return ['All brands', ...new Set(['Samsung', 'Tecno', 'Redmi', 'Infinix',
    ...coverInventoryRows().map(row => row.brand)])];
}
function renderCoverBrands() {
  brandFilters.innerHTML = coverBrands().map(brand => `<button class="filter-tab" data-brand="${escapeHTML(brand)}" aria-pressed="${brand === selectedBrand}">${escapeHTML(brand)}</button>`).join('');
}
function renderModels() {
  modelSection.hidden = selectedBrand === 'All brands';
  const models = coverModels(selectedBrand);
  modelButtons.innerHTML = `<button class="model-pill" data-model="" aria-pressed="${selectedModel === ''}">All</button>` + models.map(model => `<button class="model-pill" data-model="${escapeHTML(model)}" aria-pressed="${model === selectedModel}">${escapeHTML(model)}</button>`).join('');
  modelButtons.setAttribute('aria-label', `${selectedBrand} phone models`);
  modelStatus.textContent = models.length ? selectedModel ? `${selectedBrand} ${selectedModel}` : `All ${selectedBrand} models` : `No available ${selectedBrand} models listed yet.`;
}
function renderFinishes() {
  finishFilters.innerHTML = ['All finishes', ...COVER_TYPES].map(finish => `<option value="${finish}" ${finish === selectedFinish ? "selected" : ""}>${finish}</option>`).join('');
}
function coverCard(product, variant) {
  const remaining = Math.max(0, variant.stock - (getCart()[variant.id] || 0));
  return `<article class="card"><div class="card-media">${productArt(product)}</div><div class="card-body"><h3 class="card-title">${escapeHTML(product.title)}</h3><p class="card-desc">For ${escapeHTML(variant.model)}</p><div class="card-footer"><span class="card-detail">${remaining ? remaining + ' available' : 'All available units in your bag'}</span></div><button class="btn btn-add" data-sku="${escapeHTML(variant.id)}" ${!remaining ? 'disabled' : ''}>${remaining ? 'Add to bag' : 'In your bag'}</button></div></article>`;
}
function renderCovers() {
  const allBrands = selectedBrand === 'All brands';
  const rows = coverInventoryRows().filter(row => (allBrands || row.brand === selectedBrand) && (!selectedModel || row.model === selectedModel));
  const shown = rows.map(row => ({product: coverVariant(row), variant: coverVariant(row)})).filter(item => selectedFinish === 'All finishes' || item.product.type === selectedFinish);
  const brands = allBrands ? coverBrands().filter(brand => brand !== 'All brands') : [selectedBrand];
  protectorGrid.innerHTML = brands.map(brand => {
    const brandItems = shown.filter(item => item.variant.brand === brand);
    if (!brandItems.length) return '';
    const groups = COVER_TYPES.map(finish => {
      const group = brandItems.filter(item => item.product.type === finish);
      if (!group.length) return '';
      return `<section class="cover-group" aria-label="${finish} covers"><${allBrands ? 'h3' : 'h2'} class="finish-heading">${finish}<span>${group.length}</span></${allBrands ? 'h3' : 'h2'}><div class="product-grid">${group.map(item => coverCard(item.product, item.variant)).join('')}</div></section>`;
    }).join('');
    return allBrands ? `<section class="cover-brand-group" aria-label="${escapeHTML(brand)} covers"><h2 class="brand-heading">${escapeHTML(brand)}</h2>${groups}</section>` : groups;
  }).join('');
  document.getElementById('productCount').textContent = `${shown.length} available covers`;
  const empty = document.getElementById('emptyState');
  empty.hidden = shown.length > 0;
  if (!empty.hidden) empty.textContent = `No ${selectedFinish === 'All finishes' ? '' : selectedFinish.toLowerCase() + ' '}covers available${selectedModel ? ' for ' + selectedModel : allBrands ? '' : ' for ' + selectedBrand}.`;
}
brandFilters.addEventListener('click', event => {
  const button = event.target.closest('[data-brand]');
  if (!button) return;
  selectedBrand = button.dataset.brand;
  selectedModel = '';
  selectedFinish = 'All finishes';
  renderCoverBrands(); renderModels(); renderFinishes(); renderCovers();
});
modelButtons.addEventListener('click', event => {
  const button = event.target.closest('[data-model]');
  if (!button) return;
  selectedModel = button.dataset.model;
  selectedFinish = 'All finishes';
  renderModels(); renderFinishes(); renderCovers();
});
finishFilters.addEventListener('change', event => {
  selectedFinish = event.target.value;
  renderFinishes(); renderCovers();
});
protectorGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-sku]');
  if (!button || button.disabled) return;
  const product = findProduct(button.dataset.sku);
  if (!product) return;
  addToCart(product.id);
  showToast(`${product.title} for ${product.model} added to your bag`);
  renderCovers();
});
window.addEventListener('storage', () => {updateCartBadges(); renderCovers();});
renderCoverBrands(); renderModels(); renderFinishes(); renderCovers();
