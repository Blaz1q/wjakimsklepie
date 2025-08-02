class Produkt {
      constructor(nazwa, cena, staracena,link, category,shop) {
        this.nazwa = nazwa;
        this.cena = cena;
        this.staracena = staracena
        this.link = link;
        this.kategoria = category;
        this.sklep = shop;
      }

      render() {
         if(this.cena==null) throw new Error("cena jest null");
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <a href="${this.link}" target="_blank">${this.nazwa}</a>
      <div class="price">${this.cena} zł</div>
      <div class="store-label">Sklep: ${this.sklep.charAt(0).toUpperCase() + this.sklep.slice(1)}</div>
    `;

    return card;
  }
  render(colorMap) {
    if(this.cena==null) throw new Error("cena jest null");
  const card = document.createElement('div');
  card.className = 'product-card';

  const storeName = this.sklep.charAt(0).toUpperCase() + this.sklep.slice(1);
  const storeColor = colorMap[this.sklep.toLowerCase()] || 'black';

  const oldPriceHtml = this.staracena
    ? `<span class="old-price">${this.staracena} zł</span>`
    : '';

  card.innerHTML = `
    <a href="${this.link}" target="_blank">${this.nazwa}</a>
    <div class="price">
      ${this.cena} zł ${oldPriceHtml}
    </div>
    <div class="store-label">Sklep: <span style="color: ${storeColor};">${storeName}</span></div>
  `;

  return card;
}
}
function getProdukt(sklep) {
  return fetch(`./${sklep}/wszystko.json`)
    .then(response => response.json())
    .then(data => {
      return data.map(item => new Produkt(item.name, item.price, item.oldprice || item.oldPrice || null,item.url || item.link, item.category,sklep));
    });
}
export { Produkt, getProdukt };