const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const storage = new Map();
const elements = new Map();
function element(id) {
  if (!elements.has(id)) elements.set(id, {innerHTML: '', textContent: '', hidden: false,
    classList: {add() {}, remove() {}, toggle() {}},
    handlers: {}, addEventListener(type, handler) {this.handlers[type] = handler;},
    setAttribute() {}, querySelectorAll() {return [];}});
  return elements.get(id);
}
const context = vm.createContext({
  document: {getElementById: element, querySelectorAll: () => [], addEventListener() {}},
  window: {addEventListener() {}}, requestAnimationFrame: callback => callback(),
  localStorage: {getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value)},
  setTimeout, clearTimeout
});
function run(code) {return vm.runInContext(code, context);}
for (const file of ['data.js', 'protector-inventory.js', 'art.js', 'cart.js']) {
  run(fs.readFileSync('js/' + file, 'utf8'));
}
assert.equal(run('PROTECTOR_INVENTORY.reduce((sum,row)=>sum+row.stock,0)'),27);
assert.equal(run('PROTECTOR_INVENTORY.find(row=>row.id === "samsung-a53-solid").stock'),2);
assert.equal(run('protectorModels("Samsung").includes("Galaxy A54")'),true);
run('PROTECTOR_INVENTORY.splice(0)');
run(`PROTECTOR_INVENTORY.push(
  {id:'test-a24-matte',brand:'Samsung',model:'Galaxy A24',productId:'ceramic-matte',price:400,stock:2},
  {id:'test-a24-clear',brand:'Samsung',model:'Galaxy A24',productId:'full-cover-glass',price:500,stock:3},
  {id:'test-a25-matte',brand:'Samsung',model:'Galaxy A25',productId:'matte-glass',price:600,stock:1},
  {id:'test-redmi-clear',brand:'Redmi',model:'13C',productId:'ok-solid-glass',price:350,stock:3},
  {id:'test-soldout',brand:'Samsung',model:'Galaxy A15',productId:'matte-glass',price:600,stock:0},
  {id:'test-invalid',brand:'Samsung',model:'Invalid',productId:'missing',price:600,stock:1}
);`);
assert.deepEqual(Array.from(run('protectorModels("Samsung")')), ['Galaxy A24','Galaxy A25']);
run(fs.readFileSync('js/protectors.js', 'utf8'));
function click(id, dataset) {element(id).handlers.click({target:{closest:()=>({dataset,disabled:false})}});}
click('typeFilters', {brand:'Samsung'});
assert.equal(element('modelSection').hidden, false);
assert.match(element('modelButtons').innerHTML, /Galaxy A24/);
assert.doesNotMatch(element('modelButtons').innerHTML, /Galaxy A15|13C|Invalid/);
assert.match(element('modelButtons').innerHTML, /data-model="" aria-pressed="true">All/);
assert.match(element('productGrid').innerHTML, /Galaxy A24/);
assert.match(element('productGrid').innerHTML, /Galaxy A25/);
assert.doesNotMatch(element('productGrid').innerHTML, /For Redmi/);
click('modelButtons', {model:'Galaxy A24'});
assert.match(element('modelButtons').innerHTML, /data-model="Galaxy A24" aria-pressed="true"/);
assert.match(element('productGrid').innerHTML, /Matte Ceramic Full-Cover Film/);
assert.match(element('productGrid').innerHTML, /Tempered Glass/);
assert.doesNotMatch(element('productGrid').innerHTML, /Matte Glass Screen Protector/);
click('modelButtons', {model:''});
assert.match(element('productGrid').innerHTML, /Galaxy A25/);
click('modelButtons', {model:'Galaxy A24'});
element('finishFilters').handlers.change({target:{value:'Matte'}});
assert.doesNotMatch(element('productGrid').innerHTML, /Tempered Glass/);
click('productGrid', {sku:'protector-stock-test-a24-matte'});
run(`addToCart('protector-stock-test-a24-matte'); addToCart('protector-stock-test-a24-matte');`);
assert.equal(run('getCartCount()'), 2, 'Adding cannot exceed stock');
run(`setCartQty('protector-stock-test-a24-matte', 20);`);
assert.equal(run('getCartTotal()'), 800);
assert.equal(run('getCartLines()[0].phone'), 'Samsung Galaxy A24');
click('typeFilters', {brand:'Redmi'});
assert.equal(run('selectedModel'), '', 'Changing brand clears model');
assert.equal(run('selectedFinish'), 'All finishes', 'Changing brand resets finish');
click('modelButtons', {model:'13C'});
assert.match(element('productGrid').innerHTML, /Tempered Glass/);
assert.doesNotMatch(element('productGrid').innerHTML, /Ceramic/);
element('finishFilters').handlers.change({target:{value:'Privacy'}});
assert.equal(element('emptyState').hidden, false);
assert.equal(element('productGrid').innerHTML, '');
click('typeFilters', {brand:'All brands'});
assert.equal(element('modelSection').hidden, true);
assert.doesNotMatch(element('productGrid').innerHTML, /Select a phone model|purple and gold pack|yellow-pack/);
assert.match(element('productGrid').innerHTML, /For Galaxy A24/);
assert.match(element('productGrid').innerHTML, /For 13C/);
assert.ok(element('productGrid').innerHTML.indexOf('Samsung protectors') < element('productGrid').innerHTML.indexOf('Redmi protectors'));
assert.equal((element('productGrid').innerHTML.match(/<article /g) || []).length, 4);
run(fs.readFileSync('js/cart-page.js', 'utf8'));
assert.match(run('buildWhatsAppMessage()'), /Matte Ceramic Full-Cover Film \(Samsung Galaxy A24\) x2/);
assert.match(run('buildWhatsAppMessage()'), /KSh 800/);
run(`PROTECTOR_INVENTORY.push({id:'unpriced-a24',brand:'Samsung',model:'Galaxy A24',productId:'ok-solid-glass',price:null,stock:1}); addToCart('protector-stock-unpriced-a24'); addToCart('protector-stock-unpriced-a24');`);
assert.equal(run("getCart()['protector-stock-unpriced-a24']"), 1);
assert.equal(run('getCartLines().find(line=>line.product.price === null).lineTotal'), null);
assert.match(run('buildWhatsAppMessage()'), /Please send me a price quote/);
assert.doesNotMatch(run('buildWhatsAppMessage()'), /KSh 0/);
click('typeFilters', {brand:'Samsung'});
assert.doesNotMatch(element('productGrid').innerHTML, /Price to be confirmed|Price coming soon/);
assert.ok(element('productGrid').innerHTML.indexOf('Clear protectors') < element('productGrid').innerHTML.indexOf('Matte protectors'));
assert.equal(run("PRODUCTS.filter(p=>p.category==='smartphones').length"), 3);
console.log('Passed: inventory-only models, finish grouping, model resets, price/stock limits, exact model in bag, empty privacy state.');
