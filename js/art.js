// Escape catalog and customer-provided text before using it in markup.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function productType(product) {
  const types = {'pr-01':'Clear','pr-02':'Privacy','pr-03':'Camera','pr-04':'Matte','cv-01':'Armor','cv-02':'Clear','cv-03':'Wallet','cv-04':'Glow'};
  return product.type || types[product.id] || (product.category === 'smartphones' ? 'Smartphone' : 'Audio');
}
// Local illustrations replace the original remote placeholder images.
// Real product image URLs in the catalog still take precedence.
function productArt(product, compact = false) {
  if (product.image && !product.image.includes('placehold.co/')) return `<img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.title)}" loading="lazy">`;
  const index = Math.max(0, PRODUCTS.findIndex(p => p.id === product.id)) % 4;
  const colors = ['#4c7990','#525b76','#bb825d','#57816b'];
  const backgrounds = ['#e7f0f3','#ebedf5','#f3ece4','#eaf0e8'];
  const color = colors[index];
  const phone = `<g transform="translate(184 34) rotate(12 42 79)"><rect width="83" height="159" rx="14" fill="#cedee2" stroke="#43555d" stroke-width="2"/><rect x="5" y="5" width="73" height="149" rx="10" fill="#f3f8f7" fill-opacity=".65"/><rect x="30" y="7" width="23" height="5" rx="3" fill="#43555d"/><path d="M12 123L68 34M26 146L74 70" stroke="white" stroke-width="4" opacity=".7"/></g>`;
  let shape;
  if (product.category === 'protectors') {
    shape = `<g transform="translate(77 19) rotate(-8 55 90)"><rect width="111" height="180" rx="5" fill="${color}"/><rect x="36" y="8" width="38" height="6" rx="3" fill="white" opacity=".5"/><text x="55" y="41" text-anchor="middle" fill="white" font-size="13" font-weight="bold">${escapeHTML(productType(product).toUpperCase())}</text><path d="M55 58L85 71L81 107Q73 131 55 139Q37 131 29 107L25 71Z" fill="white" opacity=".2"/><path d="M40 96L51 107L72 82" fill="none" stroke="white" stroke-width="5"/><text x="55" y="160" text-anchor="middle" fill="white" font-size="8">SCREEN PROTECTION</text></g>${phone}`;
  } else if (product.category === 'covers') {
    shape = `<g transform="translate(100 20) rotate(-10 60 90)"><rect width="112" height="185" rx="22" fill="${color}"/><rect x="7" y="7" width="98" height="171" rx="17" fill="none" stroke="white" opacity=".35"/><rect x="15" y="17" width="40" height="48" rx="11" fill="#233d39"/><circle cx="26" cy="30" r="7" fill="#b7ccc4"/><circle cx="43" cy="51" r="7" fill="#b7ccc4"/></g>${phone}`;
  } else if (product.category === 'earphones') {
    shape = `<path d="M110 129V98a65 65 0 0 1 130 0v31" fill="none" stroke="${color}" stroke-width="17"/><rect x="93" y="109" width="40" height="78" rx="18" fill="${color}"/><rect x="217" y="109" width="40" height="78" rx="18" fill="${color}"/>`;
  } else {
    shape = `<g transform="translate(100 15) rotate(-9 52 94)"><rect width="104" height="190" rx="19" fill="${color}"/><rect x="13" y="14" width="40" height="49" rx="11" fill="#233d39"/><circle cx="25" cy="27" r="8" fill="#b7ccc4"/><circle cx="41" cy="49" r="8" fill="#b7ccc4"/></g>${phone}`;
  }
  return `${compact ? '' : `<span class="badge">${escapeHTML(productType(product).toUpperCase())}</span>`}<svg viewBox="0 0 350 230" role="img" aria-label="${escapeHTML(product.title)} illustration" style="background:${backgrounds[index]}"><ellipse cx="182" cy="207" rx="90" ry="10" fill="#000" opacity=".08"/>${shape}</svg>`;
}
