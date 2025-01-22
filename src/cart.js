import { makeReservation } from "./reservation.js";

export function cartItem(productID) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Brak tokena. Użytkownik nie jest zalogowany.");
    return;
  }
  const data = {
    productID: productID,
    quantity: 1,
  };
  console.log("Dane do dodania do koszyka:", data);
  addItemToCart(data, token);
}
async function addItemToCart(data, token) {
  try {
    const response = await fetch("http://localhost:3000/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      console.error("Błąd podczas dodawania do koszyka:", error);
      return;
    }
    const result = await response.json();
    console.log("Produkt dodany do koszyka:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}
async function getCart() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Brak tokena. Użytkownik nie jest zalogowany.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Nie udało się pobrać koszyka");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Błąd:", error);
  }
}
export async function displayCart() {
  const content = document.getElementById("content");

  const cartContent = document.createElement("div");
  cartContent.classList.add("cartContent");

  const token = localStorage.getItem("token");

  const cartItems = await getCart();
  console.log(cartItems);

  if (cartItems.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Koszyk jest pusty.";
    cartContent.appendChild(emptyMessage);
  } else {
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

      itemDiv
        .querySelector(".delete-item")
        .addEventListener("click", async () => {
          await deleteCartItem(item.product_id);
          displayCart();
        });

      cartItemsContainer.appendChild(itemDiv);
    });

    cartContent.appendChild(cartItemsContainer);

    const reserveButton = document.createElement("button");
    reserveButton.textContent = "Potwierdź rezerwację";
    reserveButton.classList.add("reserve-btn");

    reserveButton.addEventListener("click", async (event) => {
      event.preventDefault();

      const startDate = reservationForm.querySelector("#startDate").value;
      const endDate = reservationForm.querySelector("#endDate").value;
      const comments = reservationForm.querySelector("#comments").value;

      if (!startDate || !endDate) {
        alert("Proszę uzupełnić datę rozpoczęcia i zakończenia rezerwacji.");
        return;
      }

      for (const item of cartItems) {
        await makeReservation({
          carID: item.product_id,
          start_date: startDate,
          end_date: endDate,
          comments: comments,
          status: "pending",
        });
      }

      await clearCart();

      alert(
        "Rezerwacja została pomyślnie dodana i koszyk został wyczyszczony!"
      );
      displayCart();
    });
    if (cartItems.length > 0) {
      cartContent.appendChild(reserveButton);
    }
  }
  content.innerHTML = "";
  content.appendChild(cartContent);
}
async function deleteCartItem(productId) {
  try {
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
      console.log(`Przedmiot o ID ${productId} został usunięty z koszyka.`);
      return result;
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
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  await fetch(`http://localhost:3000/cart/clear`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
