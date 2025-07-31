class Produkt {
      constructor(nazwa, cena, link, category,shop) {
        this.nazwa = nazwa;
        this.cena = cena;
        this.link = link;
        this.kategoria = category;
        this.sklep = shop;
      }

      render() {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <a href="${this.link}" target="_blank">${this.nazwa}</a>
      <div class="price">${this.cena} zł</div>
      <div class="store-label">Sklep: ${this.sklep.charAt(0).toUpperCase() + this.sklep.slice(1)}</div>
    `;

    return card;
  }
}
function getProdukt(sklep) {
  return fetch(`./${sklep}/wszystko.json`)
    .then(response => response.json())
    .then(data => {
      return data.map(item => new Produkt(item.name, item.price, item.url || item.link, item.category,sklep));
    });
}
export { Produkt, getProdukt };