export async function makeReservation(reservation) {
  try {
    const response = await fetch("http://localhost:3000/cart/makeReservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservation),
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("Error ", result);
      return;
    }
    console.log(`Reservation successful: ${JSON.stringify(result)}`);
  } catch (error) {
    console.error("Error:", error);
  }
}
async function getReservations() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userID = user.id;
  const response = await fetch(`http://localhost:3000/reservation/${userID}`);
  const result = await response.json();
  console.log(result);
  return result;
}
async function getCar(carID) {
  const response = await fetch(`http://localhost:3000/cars/${carID}`);
  const result = await response.json();
  console.log(result);
  return result;
}
export async function displayUserPanel() {
  const content = document.getElementById("content");

  // Pobranie listy rezerwacji użytkownika
  const reservations = await getReservations();
  console.log(reservations);

  // Utworzenie panelu użytkownika
  const panel = document.createElement("div");
  panel.classList.add("panel");

  const panelHeader = document.createElement("h2");
  panelHeader.textContent = "Twoje Rezerwacje";
  panel.appendChild(panelHeader);

  const reservationList = document.createElement("div");
  reservationList.classList.add("reservation-list");

  if (reservations.length === 0) {
    const noReservationsMessage = document.createElement("p");
    noReservationsMessage.textContent =
      "Nie masz żadnych aktywnych rezerwacji.";
    reservationList.appendChild(noReservationsMessage);
  } else {
    // Dla każdej rezerwacji twórz kartę
    console.log(reservations);
    for (const reservation of reservations) {
      const carDetails = await getCar(reservation.car_id);
      console.log(carDetails);

      const reservationCard = document.createElement("div");
      reservationCard.classList.add("reservation-card");

      const formattedStart = reservation.start_date.split("T")[0];
      const formattedEnd = reservation.end_date.split("T")[0];

      reservationCard.innerHTML = `
        <div class="car-info">
          <img src="${carDetails[0].image_url}" alt="${carDetails[0].brand} ${
        carDetails[0].model
      }" class="car-image"/>
          <div>
            <h3>${carDetails[0].brand} ${carDetails[0].model} (${
        carDetails[0].year
      })</h3>
            <p><strong>Rodzaj silnika:</strong> ${carDetails[0].engine_type}</p>
            <p><strong>Nadwozie:</strong> ${carDetails[0].drive_type}, drzwi: ${
        carDetails[0].doors
      }</p>
            <p><strong>Pojemność bagażnika:</strong> ${
              carDetails[0].trunk_capacity
            } L</p>
            <p><strong>Cena za dzień:</strong> ${
              carDetails[0].price_per_day
            } PLN</p>
          </div>
        </div>
        <div class="reservation-details">
          <p><strong>Rezerwacja:</strong> ${formattedStart} - ${formattedEnd}</p>
          <p><strong>Status:</strong> ${reservation.status}</p>
          ${
            reservation.comments
              ? `<p><strong>Uwagi:</strong> ${reservation.comments}</p>`
              : ""
          }
        </div>
      `;
      reservationList.appendChild(reservationCard);
    }
  }

  panel.appendChild(reservationList);

  // Wyczyszczenie zawartości i dodanie nowego panelu
  content.innerHTML = "";
  content.appendChild(panel);
}
