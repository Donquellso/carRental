export function loadContact() {
  const content = document.getElementById("content");
  content.innerHTML = ""; // Wyczyść poprzednią zawartość

  // Stwórz główny kontener kontaktu
  const contactSection = document.createElement("div");
  contactSection.classList.add("contact");

  contactSection.innerHTML = `
      <h1>Skontaktuj się z nami</h1>
      <p>Jeśli masz jakiekolwiek pytania, śmiało skontaktuj się z nami, wypełniając formularz poniżej lub korzystając z podanych danych kontaktowych.</p>
      
      <div class="contact-container">
        <form class="contact-form">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" placeholder="Twoje imię" required />
  
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Twój email" required />
  
          <label for="message">Wiadomość:</label>
          <textarea id="message" name="message" placeholder="Twoja wiadomość" rows="5" required></textarea>
  
          <button type="submit" class="submit-btn">Wyślij wiadomość</button>
        </form>
  
        <div class="contact-info">
          <h2>Nasze dane kontaktowe</h2>
          <p><strong>Email:</strong> carRental@contact.com</p>
          <p><strong>Telefon:</strong> +48 123 456 789</p>
          <p><strong>Adres:</strong> ul Adama Mickiewicza 29, Katowice 44-200</p>
        </div>
      </div>
    `;

  content.appendChild(contactSection);
}
