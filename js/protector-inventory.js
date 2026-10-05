// Actual stock goes here once the store inventory is supplied.
// One row per phone model and protector product. Keep each id unique and stable.
// Shape: {id: 'unique-sku', brand: 'Samsung', model: 'Galaxy A24',
//         productId: 'ceramic-matte', price: 0, stock: 0}
// price is in KSh; stock must be a non-negative whole number.
const PROTECTOR_INVENTORY = [];

const PROTECTOR_CATALOG = [
  {id: 'ceramic-matte', category: 'protectors', type: 'Matte', title: 'Matte Ceramic Full-Cover Film',
   description: 'Full-coverage ceramic screen protector with a matte finish.',
   image: 'assets/ProtectorTypes/studio/ceramic-film-matte-studio.png'},
  {id: 'matte-glass', category: 'protectors', type: 'Matte', title: 'Matte Glass Screen Protector',
   description: 'The yellow-pack matte glass screen protector.',
   image: 'assets/ProtectorTypes/studio/matte-glass-studio.png'},
  {id: 'full-cover-glass', category: 'protectors', type: 'Clear', title: 'Full-Cover Tempered Glass',
   description: 'Clear full-cover screen protection in the purple and gold pack.',
   image: 'assets/ProtectorTypes/studio/full-cover-glass-studio.png'},
  {id: 'ok-solid-glass', category: 'protectors', type: 'Clear', title: 'OK SOLID Tempered Glass',
   description: 'Clear tempered glass screen protection in the blue gorilla pack.',
   image: 'assets/ProtectorTypes/studio/tempered-glass-studio.png'}
];
// A Privacy product can be added here when its product details are supplied.
const PROTECTOR_FINISHES = ['Matte', 'Clear', 'Privacy'];
function protectorInventoryRows() {
  return PROTECTOR_INVENTORY.filter(row =>
    typeof row.id === 'string' && /^[a-zA-Z0-9_-]+$/.test(row.id) &&
    typeof row.brand === 'string' && row.brand.trim() &&
    typeof row.model === 'string' && row.model.trim() &&
    Number.isFinite(row.price) && row.price >= 0 &&
    Number.isInteger(row.stock) && row.stock > 0 &&
    PROTECTOR_CATALOG.some(product => product.id === row.productId));
}
function protectorModels(brand) {
  return [...new Set(protectorInventoryRows()
    .filter(row => row.brand === brand).map(row => row.model))]
    .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
}
function protectorVariant(row) {
  const product = PROTECTOR_CATALOG.find(product => product.id === row.productId);
  if (!product) return null;
  return {...product, id: 'protector-stock-' + row.id,
    brand: row.brand, model: row.model, price: row.price, stock: row.stock};
}
