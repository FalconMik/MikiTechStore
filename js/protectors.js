const brandFilters = document.getElementById('typeFilters');
const modelSection = document.getElementById('modelSection');
const modelButtons = document.getElementById('modelButtons');
const modelStatus = document.getElementById('modelStatus');
const finishFilters = document.getElementById('finishFilters');
const protectorGrid = document.getElementById('productGrid');
let selectedBrand = 'All brands';
let selectedModel = '';
let selectedFinish = 'All finishes';
function protectorBrands() {
  return ['All brands', ...new Set(['Samsung', 'Tecno', 'Redmi', 'Apple', 'Infinix',
    ...protectorInventoryRows().map(row => row.brand)])];
}
function renderProtectorBrands() {
  brandFilters.innerHTML = protectorBrands().map(brand => `<button class="filter-tab" data-brand="${escapeHTML(brand)}" aria-pressed="${brand === selectedBrand}">${escapeHTML(brand)}</button>`).join('');
}
function renderModels() {
  modelSection.hidden = selectedBrand === 'All brands';
  const models = protectorModels(selectedBrand);
  modelButtons.innerHTML = `<button class="model-pill" data-model="" aria-pressed="${selectedModel === ''}">All</button>` + models.map(model => `<button class="model-pill" data-model="${escapeHTML(model)}" aria-pressed="${model === selectedModel}">${escapeHTML(model)}</button>`).join('');
  modelButtons.setAttribute('aria-label', `${selectedBrand} phone models`);
  modelStatus.textContent = models.length ? selectedModel ? `${selectedBrand} ${selectedModel}` : `All ${selectedBrand} models` : `No available ${selectedBrand} models listed yet.`;
}
function renderFinishes() {
  finishFilters.innerHTML = ['All finishes', ...PROTECTOR_FINISHES].map(finish => `<option value="${finish}" ${finish === selectedFinish ? "selected" : ""}>${finish}</option>`).join('');
}
function protectorCard(product, variant) {
  const remaining = Math.max(0, variant.stock - (getCart()[variant.id] || 0));
  return `<article class="card"><div class="card-media">${productArt(product)}</div><div class="card-body"><h3 class="card-title">${escapeHTML(product.title)}</h3><p class="card-desc">For ${escapeHTML(variant.model)}</p><div class="card-footer"><span class="card-detail">${remaining ? remaining + ' available' : 'All available units in your bag'}</span></div><button class="btn btn-add" data-sku="${escapeHTML(variant.id)}" ${!remaining ? 'disabled' : ''}>${remaining ? 'Add to bag' : 'In your bag'}</button></div></article>`;
}
function renderProtectors() {
  const allBrands = selectedBrand === 'All brands';
  const rows = protectorInventoryRows().filter(row => (allBrands || row.brand === selectedBrand) && (!selectedModel || row.model === selectedModel));
  const shown = rows.map(row => ({product: PROTECTOR_CATALOG.find(product => product.id === row.productId), variant: protectorVariant(row)})).filter(item => selectedFinish === 'All finishes' || item.product.type === selectedFinish);
  const brands = allBrands ? protectorBrands().filter(brand => brand !== 'All brands') : [selectedBrand];
  protectorGrid.innerHTML = brands.map(brand => {
    const brandItems = shown.filter(item => item.variant.brand === brand);
    if (!brandItems.length) return '';
    const groups = PROTECTOR_FINISHES.map(finish => {
      const group = brandItems.filter(item => item.product.type === finish);
      if (!group.length) return '';
      return `<section class="protector-group" aria-label="${finish} protectors"><${allBrands ? 'h3' : 'h2'} class="finish-heading">${finish}<span>${group.length}</span></${allBrands ? 'h3' : 'h2'}><div class="product-grid">${group.map(item => protectorCard(item.product, item.variant)).join('')}</div></section>`;
    }).join('');
    return allBrands ? `<section class="protector-brand-group" aria-label="${escapeHTML(brand)} protectors"><h2 class="brand-heading">${escapeHTML(brand)}</h2>${groups}</section>` : groups;
  }).join('');
  document.getElementById('productCount').textContent = `${shown.length} available protectors`;
  const empty = document.getElementById('emptyState');
  empty.hidden = shown.length > 0;
  if (!empty.hidden) empty.textContent = `No ${selectedFinish === 'All finishes' ? '' : selectedFinish.toLowerCase() + ' '}protectors available${selectedModel ? ' for ' + selectedModel : allBrands ? '' : ' for ' + selectedBrand}.`;
}
brandFilters.addEventListener('click', event => {
  const button = event.target.closest('[data-brand]');
  if (!button) return;
  selectedBrand = button.dataset.brand;
  selectedModel = '';
  selectedFinish = 'All finishes';
  renderProtectorBrands(); renderModels(); renderFinishes(); renderProtectors();
});
modelButtons.addEventListener('click', event => {
  const button = event.target.closest('[data-model]');
  if (!button) return;
  selectedModel = button.dataset.model;
  selectedFinish = 'All finishes';
  renderModels(); renderFinishes(); renderProtectors();
});
finishFilters.addEventListener('change', event => {
  selectedFinish = event.target.value;
  renderFinishes(); renderProtectors();
});
protectorGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-sku]');
  if (!button || button.disabled) return;
  const product = findProduct(button.dataset.sku);
  if (!product) return;
  addToCart(product.id);
  showToast(`${product.title} for ${product.model} added to your bag`);
  renderProtectors();
});
window.addEventListener('storage', () => {updateCartBadges(); renderProtectors();});
renderProtectorBrands(); renderModels(); renderFinishes(); renderProtectors();
