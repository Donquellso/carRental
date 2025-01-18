import { cartItem } from "./cart.js";

export function loadCars() {
  async function getCars() {
    try {
      const response = await fetch("http://localhost:3000/cars");
      if (!response.ok) {
        throw new Error("Error");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }
  let carsTab = [];
  const content = document.getElementById("content");
  let cars = document.createElement("div");
  cars.classList.add("cars");
  content.innerHTML = "";
  async function displayCars() {
    carsTab = await getCars();
    for (let element of carsTab) {
      console.log(element);
      const carDiv = document.createElement("div");
      carDiv.classList.add("carDiv");
      carDiv.innerHTML = `
  <h3 id="${element.id}" class="car-title">${element.brand} ${element.model} (${element.year})</h3>
    <img src="${element.image_url}" class="car-image">
    <p><strong>Rodzaj paliwa:</strong> ${element.engine_type}</p>
    <p><strong>Cena od:</strong> ${element.price_per_day} zł</p>
    <a class="details">Sprawdź szczegóły</a>
`;

      cars.appendChild(carDiv);
    }
  }
  cars.addEventListener("click", (event) => {
    if (event.target.matches("a.details")) {
      const carDiv = event.target.closest(".carDiv");
      const carID = carDiv.querySelector("h3").id;

      displayPopup(carID);
    }
  });
  function displayPopup(carID) {
    const carPopup = document.getElementById("carPopup");
    carPopup.classList.add("popup-show");
    const popupcontent = document.querySelector(".carPopupContent");
    const closeButton = document.getElementById("car-close-btn");
    popupcontent.innerHTML = "";
    popupcontent.appendChild(closeButton);
    let findCar = carsTab.find((car) => car.id == carID);
    const details = document.createElement("span");
    details.innerHTML = `<h3 class="car-title">${findCar.brand} ${findCar.model} (${findCar.year})</h3>
      <img src="${findCar.image_url}" id="carimg" class="car-image">
        <p><strong>Rodzaj paliwa:</strong> ${findCar.engine_type}</p>
        <p><strong>Nadwozie:</strong> ${findCar.drive_type}</p>
        <p><strong>Liczba drzwi:</strong> ${findCar.doors}</p>
        <p><strong>Pojemność bagażnika:</strong> ${findCar.trunk_capacity} L</p>
        <p><strong>Cena za dzień:</strong> ${findCar.price_per_day} zł</p>
      `;

    const message = document.createElement("p");
    message.id = "popup-message"; // Identyfikator do aktualizowania treści
    message.classList.add("popup-message"); // Stylizowanie CSS
    message.textContent = "";

    const button = document.createElement("button");
    button.classList.add("details");
    button.textContent = "Dodaj do koszyka";
    button.addEventListener("click", () => {
      message.textContent = "Produkt został dodany do koszyka";
      cartItem(findCar.id);
    });
    details.appendChild(message);
    details.appendChild(button);
    popupcontent.appendChild(details);
  }
  document.getElementById("car-close-btn").onclick = () => {
    const carPopup = document.getElementById("carPopup");
    carPopup.classList.remove("popup-show");
  };
  displayCars();
  content.appendChild(cars);
}
