import { getProdukt, Produkt } from './load.js';

let wszystkieProdukty = [];

let result_elem = document.getElementById("search-result");
const checkboxBiedronka = document.getElementById("checkbox-biedronka");
const checkboxCarrefour = document.getElementById("checkbox-carrefour");
const checkboxAuchan = document.getElementById("checkbox-auchan");
const checkboxStokrotka = document.getElementById("checkbox-stokrotka");

Promise.all([
  getProdukt("biedronka"),
  getProdukt("carrefour"),
  getProdukt("auchan"),
  getProdukt("stokrotka"),
]).then(([biedronka, carrefour, auchan, stokrotka]) => {
  // Dodaj pole "sklep" do obiektu, aby później filtrować
  biedronka.forEach(p => p.sklep = "biedronka");
  carrefour.forEach(p => p.sklep = "carrefour");
  auchan.forEach(p => p.sklep = "auchan");
  stokrotka.forEach(p => p.sklep = "stokrotka");
  wszystkieProdukty = [...biedronka, ...carrefour, ...auchan, ...stokrotka];
  console.log("Produkty załadowane:", wszystkieProdukty);
});

document.getElementById("search-button").addEventListener("click", szukaj);

function szukaj() {
  const err = document.getElementById('search-error');
  const tekst = document.getElementById("search-input").value;
  const limitValue = document.getElementById("limit-select").value;
  if(tekst=="") return;
  const aktywneSklepy = [];

  if (checkboxBiedronka.checked) aktywneSklepy.push("biedronka");
  if (checkboxCarrefour.checked) aktywneSklepy.push("carrefour");
  if (checkboxAuchan.checked) aktywneSklepy.push("auchan");
  if (checkboxStokrotka.checked) aktywneSklepy.push("stokrotka");

  var produkty = wyszukajProduktyFraza(tekst)
    .filter(p => aktywneSklepy.includes(p.sklep))
    .sort((a, b) => a.cena - b.cena);
  if (limitValue !== "all") {
    produkty = produkty.slice(0, parseInt(limitValue));
  }
  result_elem.innerHTML = "";
  produkty.forEach(produkt => {
    result_elem.append(produkt.render());
  });
  err.innerHTML = "";
  if(produkty.length==0){
    
    err.innerHTML = "Brak produktów :(";
  }
}

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "");
}

function wyszukajProduktyFraza(tekst) {
  const slowa = normalize(tekst).split(/\s+/).filter(s => s);

  return wszystkieProdukty.filter(produkt => {
    const nazwa = normalize(produkt.nazwa);
    return slowa.every(slowo => nazwa.includes(slowo));
  });
}
window.szukaj = szukaj;