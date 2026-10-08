// Stock supplied by the store owner. Repeated entries are combined.
// One row per phone model and protector product. Keep each id unique and stable.
// Shape: {id: 'unique-sku', brand: 'Samsung', model: 'Galaxy A24',
//         productId: 'ceramic-matte', price: 0, stock: 0}
// price is in KSh, or null until supplied; stock is a non-negative whole number.
const PROTECTOR_INVENTORY = [
  {id: 'samsung-a52-star', brand: 'Samsung', model: 'Galaxy A52', productId: 'star-clear', price: null, stock: 1},
  {id: 'infinix-hot9-esd', brand: 'Infinix', model: 'Hot 9', productId: 'esd-full-glue', price: null, stock: 3},
  {
    "id": "samsung-a53-solid",
    "brand": "Samsung",
    "model": "Galaxy A53",
    "productId": "ok-solid-glass",
    "price": null,
    "stock": 2
  },
  {
    "id": "redmi-note11-solid",
    "brand": "Redmi",
    "model": "Note 11",
    "productId": "ok-solid-glass",
    "price": null,
    "stock": 1
  },
  {
    "id": "samsung-a50-solid",
    "brand": "Samsung",
    "model": "Galaxy A50",
    "productId": "ok-solid-glass",
    "price": null,
    "stock": 1
  },
  {
    "id": "samsung-a15-solid",
    "brand": "Samsung",
    "model": "Galaxy A15",
    "productId": "ok-solid-glass",
    "price": null,
    "stock": 2
  },
  {
    "id": "samsung-a24-solid",
    "brand": "Samsung",
    "model": "Galaxy A24",
    "productId": "ok-solid-glass",
    "price": null,
    "stock": 2
  },
  {
    "id": "samsung-a51-solid",
    "brand": "Samsung",
    "model": "Galaxy A51",
    "productId": "ok-solid-glass",
    "price": null,
    "stock": 1
  },
  {
    "id": "samsung-a54-ceramic",
    "brand": "Samsung",
    "model": "Galaxy A54",
    "productId": "ceramic-matte",
    "price": null,
    "stock": 2
  },
  {
    "id": "samsung-a55-ceramic",
    "brand": "Samsung",
    "model": "Galaxy A55",
    "productId": "ceramic-matte",
    "price": null,
    "stock": 2
  },
  {
    "id": "redmi-13c-full-cover",
    "brand": "Redmi",
    "model": "13C",
    "productId": "full-cover-glass",
    "price": null,
    "stock": 3
  },
  {
    "id": "tecno-camon30-full-cover",
    "brand": "Tecno",
    "model": "Camon 30",
    "productId": "full-cover-glass",
    "price": null,
    "stock": 1
  },
  {
    "id": "samsung-a15-matte",
    "brand": "Samsung",
    "model": "Galaxy A15",
    "productId": "matte-glass",
    "price": null,
    "stock": 2
  },
  {
    "id": "samsung-a05-matte",
    "brand": "Samsung",
    "model": "Galaxy A05",
    "productId": "matte-glass",
    "price": null,
    "stock": 2
  },
  {
    "id": "redmi-14c-privacy",
    "brand": "Redmi",
    "model": "14C",
    "productId": "privacy-glass",
    "price": null,
    "stock": 2
  }
];

const PROTECTOR_CATALOG = [
  {id: 'ceramic-matte', category: 'protectors', type: 'Matte', title: 'Matte Ceramic Full-Cover Film',
   description: 'Full-coverage ceramic screen protector with a matte finish.',
   image: 'assets/ProtectorTypes/studio/ceramic-film-matte-studio.png'},
  {id: 'matte-glass', category: 'protectors', type: 'Matte', title: 'Matte Glass Screen Protector',
   description: 'The yellow-pack matte glass screen protector.',
   image: 'assets/ProtectorTypes/studio/matte-glass-studio.png'},
  {id: 'full-cover-glass', category: 'protectors', type: 'Clear', title: 'Tempered Glass',
   description: 'Clear full-cover screen protection in the purple and gold pack.',
   image: 'assets/ProtectorTypes/studio/full-cover-glass-studio.png'},
  {id: 'ok-solid-glass', category: 'protectors', type: 'Clear', title: 'Tempered Glass',
   description: 'Clear tempered glass screen protection in the blue gorilla pack.',
   image: 'assets/ProtectorTypes/studio/tempered-glass-studio.png'},
  {id: 'star-clear', category: 'protectors', type: 'Clear', title: 'Star Clear Screen Protector',
   description: 'Clear screen protection.', image: ''},
  {id: 'esd-full-glue', category: 'protectors', type: 'Clear', title: 'OG ESD Full-Glue Protector',
   description: 'Clear full-glue screen protector.', image: ''},
  {id: 'privacy-glass', category: 'protectors', type: 'Privacy', title: 'Privacy Screen Protector',
   description: 'Privacy screen protection.', image: ''}
];
// The privacy product uses an illustration until its photo is supplied.
const PROTECTOR_FINISHES = ['Clear', 'Matte', 'Privacy'];
function protectorInventoryRows() {
  return PROTECTOR_INVENTORY.filter(row =>
    typeof row.id === 'string' && /^[a-zA-Z0-9_-]+$/.test(row.id) &&
    typeof row.brand === 'string' && row.brand.trim() &&
    typeof row.model === 'string' && row.model.trim() &&
    (row.price === null || (Number.isFinite(row.price) && row.price >= 0)) &&
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
