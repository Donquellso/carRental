import { makeReservation } from "./reservation.js";

export function cartItem(productID) {
  const user = JSON.parse(localStorage.getItem("user"));
  const userID = user.id;
  const data = {
    userID: userID,
    productID: productID,
    quantity: 1,
  };
  console.log(data);
  addItemToCart(data);
}
async function addItemToCart(data) {
  try {
    const response = await fetch("http://localhost:3000/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("Error ", result);
      return;
    }
    console.log(`Login successful: ${JSON.stringify(result)}`);
  } catch (error) {
    console.error("Error:", error);
  }
}
async function getCart() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userID = user.id;
  const response = await fetch(`http://localhost:3000/cart/${userID}`);
  const result = await response.json();
  return result;
}
export async function displayCart() {
  const content = document.getElementById("content");

  // Kontener dla zawartości koszyka
  const cartContent = document.createElement("div");
  cartContent.classList.add("cartContent");
  // Lista przedmiotów z koszyka
  const cartItems = await getCart();
  console.log(cartItems);

  // Sprawdzamy, czy są przedmioty w koszyku
  if (cartItems.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Koszyk jest pusty.";
    cartContent.appendChild(emptyMessage); // Dodaj komunikat o pustym koszyku
  } else {
    // Formularz do wprowadzenia daty rezerwacji
    const reservationForm = document.createElement("form");
    reservationForm.classList.add("reservation-form");

    reservationForm.innerHTML = `
    <h3>Wprowadź daty rezerwacji</h3>
    <label for="startDate">Data rozpoczęcia:</label>
    <input type="date" id="startDate" name="startDate" required />

    <label for="endDate">Data zakończenia:</label>
    <input type="date" id="endDate" name="endDate" required />

    <label for="comments">Uwagi (opcjonalnie):</label>
    <textarea id="comments" name="comments" rows="4" style="resize: none;"></textarea>
  `;
    cartContent.appendChild(reservationForm);
    const cartItemsContainer = document.createElement("div");
    cartItemsContainer.classList.add("cart-items-container");

    cartItems.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cartItems");

      itemDiv.innerHTML = `
        <p><strong>${item.brand}</strong></p>
        <p>Cena za dzień: ${item.price_per_day} zł</p>
        <p>Ilość: ${item.quantity}</p>
          <i class="fa-solid fa-trash-can delete-item"></i> 
        
      `;

      // Usuwanie przedmiotu (event listener na przycisk usuwania)
      itemDiv
        .querySelector(".delete-item")
        .addEventListener("click", async () => {
          await deleteCartItem(item.product_id); // Funkcja do usuwania przedmiotów
          displayCart(); // Odśwież zawartość koszyka
        });

      cartItemsContainer.appendChild(itemDiv);
    });

    cartContent.appendChild(cartItemsContainer);

    // Dodanie przycisku do finalizowania rezerwacji
    const reserveButton = document.createElement("button");
    reserveButton.textContent = "Potwierdź rezerwację";
    reserveButton.classList.add("reserve-btn");

    // Obsługa przycisku do rezerwacji
    reserveButton.addEventListener("click", async (event) => {
      event.preventDefault();

      const startDate = reservationForm.querySelector("#startDate").value;
      const endDate = reservationForm.querySelector("#endDate").value;
      const comments = reservationForm.querySelector("#comments").value;

      // Pobranie dzisiejszej daty
      if (!startDate || !endDate) {
        alert("Proszę uzupełnić datę rozpoczęcia i zakończenia rezerwacji.");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const userID = user.id;

      // Tworzymy rezerwację dla każdego przedmiotu z koszyka
      for (const item of cartItems) {
        await makeReservation({
          userID: userID,
          carID: item.product_id,
          start_date: startDate,
          end_date: endDate,
          comments: comments,
          status: "pending",
        });
      }

      // Wyczyszczenie koszyka po rezerwacji
      await clearCart();

      alert(
        "Rezerwacja została pomyślnie dodana i koszyk został wyczyszczony!"
      );
      displayCart(); // Odśwież zawartość po rezerwacji i wyczyszczeniu koszyka
    });
    if (cartItems.length > 0) {
      cartContent.appendChild(reserveButton); // Dodanie przycisku na koniec
    }
  }
  content.innerHTML = "";
  content.appendChild(cartContent);
}
// Funkcja do usuwania przedmiotu z koszyka
async function deleteCartItem(productId) {
  try {
    // Wywołanie endpointu do usunięcia przedmiotu z koszyka
    const response = await fetch(
      `http://localhost:3000/cart/removeItem/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();
    if (response.ok) {
      // Jeżeli usunięcie przebiegło pomyślnie, poinformuj użytkownika
      console.log(`Przedmiot o ID ${productId} został usunięty z koszyka.`);
      return result; // Można zwrócić wynik, jeśli chcesz na coś reagować
    } else {
      throw new Error(
        result.message || "Wystąpił problem podczas usuwania przedmiotu."
      );
    }
  } catch (error) {
    console.error("Błąd podczas usuwania przedmiotu:", error);
  }
}

async function clearCart() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userID = user.id;

  await fetch(`http://localhost:3000/cart/clear/${userID}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Błąd podczas czyszczenia koszyka");
      }
    })
    .catch((error) => {
      alert("Nie udało się wyczyścić koszyka: " + error.message);
    });
}
