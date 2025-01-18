// Funkcja generująca zawartość strony "About"
export function loadAbout() {
  const content = document.getElementById("content");

  // Tworzymy sekcję About
  const aboutSection = document.createElement("div");
  aboutSection.classList.add("about");

  // Nagłówek strony "About"
  const aboutHeader = document.createElement("div");
  aboutHeader.classList.add("about-header");
  aboutHeader.innerHTML = `
      <h1>O nas</h1>
      <p>Nasza misja, zespół i cel</p>
    `;

  aboutSection.appendChild(aboutHeader);

  // Tworzymy kontener z treścią (tekst + obrazek)
  const aboutContent = document.createElement("div");
  aboutContent.classList.add("about-content");

  // Część z tekstem
  const aboutText = document.createElement("div");
  aboutText.classList.add("about-text");
  aboutText.innerHTML = `
      <h2>Kim jesteśmy?</h2>
      <p>Jesteśmy firmą, która oferuje usługi na najwyższym poziomie. Nasza misja to dostarczenie najlepszych produktów i usług dla naszych klientów. Zadowolenie użytkowników jest naszym priorytetem. Nasz zespół to pasjonaci, którzy kochają to, co robią.</p>
      <h2>Nasza misja</h2>
      <p>Naszym celem jest pomaganie klientom w osiąganiu ich celów poprzez dostarczanie innowacyjnych i sprawdzonych rozwiązań. Zawsze stawiamy na jakość i profesjonalizm.</p>
    `;

  // Część z obrazkiem (można zmienić na własny obrazek w projekcie)

  // Dodajemy tekst i obrazek do kontenera
  aboutContent.appendChild(aboutText);
  aboutSection.appendChild(aboutContent);

  // Nasze wartości (list)
  const ourValues = document.createElement("div");
  ourValues.classList.add("our-values");
  ourValues.innerHTML = `
      <h2>Nasze wartości</h2>
      <ul>
        <li><i class="fa fa-heart"></i> Pasja</li>
        <li><i class="fa fa-thumbs-up"></i> Jakość</li>
        <li><i class="fa fa-users"></i> Zaufanie</li>
        <li><i class="fa fa-cogs"></i> Innowacyjność</li>
      </ul>
    `;
  aboutSection.appendChild(ourValues);

  // Przypisujemy zawartość do głównego kontenera (do elementu "content")
  content.innerHTML = ""; // Usuwamy poprzednią zawartość
  content.appendChild(aboutSection);
}
