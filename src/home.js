import { loadCars } from "./cars.js";

export function loadHome() {
  const content = document.getElementById("content");

  let home = document.createElement("div");
  let offer = document.createElement("span");
  offer.classList.add("offer");
  offer.textContent = "Sprawdź ofertę";
  home.appendChild(offer);
  offer.addEventListener("click", loadCars);
  home.classList.add("body-home");
  content.innerHTML = "";
  content.appendChild(home);
}
