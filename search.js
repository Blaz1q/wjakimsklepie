import { getProdukt, Produkt } from './load.js';

let wszystkieProdukty = [];

let result_elem = document.getElementById("search-result");
let sklepy_spozywcze = ["biedronka","carrefour","auchan","stokrotka"];
let drogerie = ["rossmann"];

function generateCheckbox() {
  const container = document.querySelector(".checkbox-group");
  container.innerHTML = ""; // wyczyść stare

  [...sklepy_spozywcze, ...drogerie].forEach(sklep => {
    const label = document.createElement("label");
    label.classList.add("checkbox-button");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `checkbox-${sklep}`;
    input.checked = true;
    input.addEventListener("change", szukaj);

    label.appendChild(input);
    label.append(" " + sklep.charAt(0).toUpperCase() + sklep.slice(1));
    container.appendChild(label);
  });
}

function generateDropdowns() {
  const container = document.querySelector(".checkbox-group");
  container.innerHTML = "";

  const kategorie = [
    { nazwa: "Sklepy spożywcze", sklepy: sklepy_spozywcze },
    { nazwa: "Drogerie", sklepy: drogerie }
  ];

  kategorie.forEach(kat => {
    const dropdownWrapper = document.createElement("div");
    dropdownWrapper.classList.add("dropdown");

    // Przycisk dropdown z checkboxem w środku
    const toggleBtn = document.createElement("button");
    toggleBtn.classList.add("dropdown-toggle");

    const masterCheckbox = document.createElement("input");
    masterCheckbox.type = "checkbox";
    masterCheckbox.classList.add("master-checkbox");
    masterCheckbox.checked = true;

    const labelText = document.createElement("span");
    labelText.textContent = kat.nazwa;
    const arrowIcon = document.createElement("img");
    arrowIcon.src = "strzalka.svg";
    arrowIcon.alt = "";
    arrowIcon.classList.add("dropdown-arrow");

    toggleBtn.appendChild(masterCheckbox);
    toggleBtn.appendChild(labelText);
    toggleBtn.appendChild(arrowIcon);

    // menu
    const menu = document.createElement("div");
    menu.classList.add("dropdown-menu");

    kat.sklepy.forEach(sklep => {
      const label = document.createElement("label");
      label.classList.add("checkbox-button");

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = `checkbox-${sklep}`;
      input.checked = true;
      input.addEventListener("change", szukaj);

      label.appendChild(input);
      label.append(" " + sklep.charAt(0).toUpperCase() + sklep.slice(1));
      menu.appendChild(label);
    });

    // otwieranie menu (kliknięcie w część bez checkboxa)
    toggleBtn.addEventListener("click", (e) => {
      if (e.target !== masterCheckbox) {
        menu.classList.toggle("show");
      }
    });

    // zaznacz/odznacz wszystkie
    masterCheckbox.addEventListener("click", (e) => {
      e.stopPropagation(); // zapobiega otwieraniu menu
      const checkboxes = menu.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = masterCheckbox.checked);
      updateDropdownButtonStyle(toggleBtn, masterCheckbox.checked);
      szukaj();
    });

    // ustaw początkowy styl
    updateDropdownButtonStyle(toggleBtn, masterCheckbox.checked);

    dropdownWrapper.appendChild(toggleBtn);
    dropdownWrapper.appendChild(menu);
    container.appendChild(dropdownWrapper);
  });

  // zamykanie menu po kliknięciu poza
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown-menu").forEach(menu => menu.classList.remove("show"));
    }
  });
}

function updateDropdownButtonStyle(button, isChecked) {
  if (isChecked) {
    button.style.backgroundColor = "#f1c40f";
    button.style.color = "#000";
    button.style.borderColor = "#f1c40f";
  } else {
    button.style.backgroundColor = "#fff";
    button.style.color = "#333";
    button.style.border = "2px solid #f1c40f";
  }
}



generateDropdowns();

Promise.all([...sklepy_spozywcze, ...drogerie].map(sklep => getProdukt(sklep)))
  .then(results => {
    const wszystkieSklepy = [...sklepy_spozywcze, ...drogerie];
    results.forEach((produkty, i) => {
      produkty.forEach(p => p.sklep = wszystkieSklepy[i]);
    });
    wszystkieProdukty = results.flat();
    console.log("Produkty załadowane:", wszystkieProdukty);
  });

document.getElementById("search-button").addEventListener("click", szukaj);

function szukaj() {
  const err = document.getElementById('search-error');
  const tekst = document.getElementById("search-input").value;
  const limitValue = document.getElementById("limit-select").value;

  if (tekst == "") return;

  const aktywneSklepy = [...document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked')]
    .map(cb => cb.id.replace("checkbox-", ""));

  let produkty = wyszukajProduktyFraza(tekst)
    .filter(p => aktywneSklepy.includes(p.sklep))
    .sort((a, b) => a.cena - b.cena);

  if (limitValue !== "all") {
    produkty = produkty.slice(0, parseInt(limitValue));
  }

  result_elem.innerHTML = "";
  produkty.forEach(produkt => result_elem.append(produkt.render()));

  err.innerHTML = produkty.length === 0 ? "Brak produktów :(" : "";
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