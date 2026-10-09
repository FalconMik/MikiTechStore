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
run(fs.readFileSync('js/cover-inventory.js','utf8'));
run(fs.readFileSync('js/covers.js','utf8'));
function click(id,dataset) {element(id).handlers.click({target:{closest:()=>({dataset,disabled:false})}});}
assert.equal(run('COVER_INVENTORY.length'),20);
assert.equal(run('COVER_INVENTORY.reduce((s,r)=>s+r.stock,0)'),22);
assert.equal((element('productGrid').innerHTML.match(/<article /g)||[]).length,20);
assert.ok(element('productGrid').innerHTML.indexOf('Samsung covers')<element('productGrid').innerHTML.indexOf('Tecno covers'));
click('typeFilters',{brand:'Tecno'});
click('modelButtons',{model:'Spark 30C'});
assert.equal((element('productGrid').innerHTML.match(/<article /g)||[]).length,2);
assert.match(element('productGrid').innerHTML,/Plastic · Black/);
assert.match(element('productGrid').innerHTML,/Plastic · Blue/);
click('typeFilters',{brand:'Samsung'});
click('modelButtons',{model:'Galaxy A35 5G'});
assert.equal((element('productGrid').innerHTML.match(/<article /g)||[]).length,2);
element('finishFilters').handlers.change({target:{value:'Silicone'}});
assert.equal(element('emptyState').hidden,false);
assert.match(element('emptyState').textContent,/covers available/);
click('typeFilters',{brand:'Redmi'});
const sku=run("'cover-stock-'+COVER_INVENTORY.find(r=>r.brand==='Redmi').id");
click('productGrid',{sku});click('productGrid',{sku});click('productGrid',{sku});
assert.equal(run('getCartCount()'),2);
assert.equal(run('getCartLines()[0].phone'),'Redmi 14C');
run(fs.readFileSync('js/cart-page.js','utf8'));
assert.match(run('buildWhatsAppMessage()'),/Plastic · Black \(Redmi 14C\) x2/);
assert.match(run('buildWhatsAppMessage()'),/price quote/);
assert.doesNotMatch(run('buildWhatsAppMessage()'),/KSh 0/);
console.log('Passed: 22 covers, 20 variants, brand/model/type filters, colour variants, bag stock limit and quote.');
