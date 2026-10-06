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
  modelButtons.innerHTML = models.map(model => `<button class="model-pill" data-model="${escapeHTML(model)}" aria-pressed="${model === selectedModel}">${escapeHTML(model)}</button>`).join('');
  modelButtons.setAttribute('aria-label', `${selectedBrand} phone models`);
  modelStatus.textContent = models.length ? selectedModel ? `${selectedBrand} ${selectedModel}` : 'Select your phone model.' : `No available ${selectedBrand} models listed yet.`;
}
function renderFinishes() {
  finishFilters.innerHTML = ['All finishes', ...PROTECTOR_FINISHES].map(finish => `<option value="${finish}" ${finish === selectedFinish ? "selected" : ""}>${finish}</option>`).join('');
}
function protectorCard(product, variant) {
  const priced = variant && Number.isFinite(variant.price);
  const totalStock = protectorInventoryRows().filter(row => row.productId === product.id).reduce((sum, row) => sum + row.stock, 0);
  const remaining = variant ? Math.max(0, variant.stock - (getCart()[variant.id] || 0)) : 0;
  return `<article class="card"><div class="card-media">${productArt(product)}</div><div class="card-body"><h3 class="card-title">${escapeHTML(product.title)}</h3><p class="card-desc">${escapeHTML(product.description)}</p><div class="card-footer">${variant ? `<span class="card-price">${priced ? formatPrice(variant.price) : "Price to be confirmed"}</span><span class="card-detail">${remaining ? remaining + ' available' : 'All available units in your bag'}</span>` : `<span class="card-detail">${totalStock} available across models</span>`}</div>${variant ? `<p class="fit-note">For ${escapeHTML(variant.brand)} ${escapeHTML(variant.model)}</p>` : ''}<button class="btn btn-add" ${variant ? `data-sku="${escapeHTML(variant.id)}"` : ''} ${!remaining || !priced ? 'disabled' : ''}>${variant ? !priced ? 'Price coming soon' : remaining ? 'Add to bag' : 'In your bag' : 'Select a phone model'}</button></div></article>`;
}
function renderProtectors() {
  const preview = selectedBrand === 'All brands';
  const rows = protectorInventoryRows().filter(row => row.brand === selectedBrand && row.model === selectedModel);
  const items = preview ? PROTECTOR_CATALOG.map(product => ({product, variant: null})) : rows.map(row => ({product: PROTECTOR_CATALOG.find(product => product.id === row.productId), variant: protectorVariant(row)}));
  const shown = items.filter(item => selectedFinish === 'All finishes' || item.product.type === selectedFinish);
  protectorGrid.innerHTML = PROTECTOR_FINISHES.filter(finish => selectedFinish === 'All finishes' || finish === selectedFinish).map(finish => {
    const group = shown.filter(item => item.product.type === finish);
    if (!group.length) return '';
    return `<section class="protector-group" aria-label="${finish} protectors"><h2 class="finish-heading">${finish}<span>${group.length}</span></h2><div class="product-grid">${group.map(item => protectorCard(item.product, item.variant)).join('')}</div></section>`;
  }).join('');
  document.getElementById('productCount').textContent = preview ? `${shown.length} protector types` : `${shown.length} available protectors`;
  const empty = document.getElementById('emptyState');
  empty.hidden = shown.length > 0;
  if (!empty.hidden) empty.textContent = !preview && !selectedModel ? protectorModels(selectedBrand).length ? 'Select a phone model to see its available protectors.' : `No available ${selectedBrand} models listed yet.` : `No ${selectedFinish === 'All finishes' ? '' : selectedFinish.toLowerCase() + ' '}protectors listed${selectedModel ? ' for ' + selectedModel : ''}.`;
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
