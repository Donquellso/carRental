import { initPopups } from "./signup.js";
import { loadHome } from "./home.js";
import { loadCars } from "./cars.js";
import { displayCart } from "./cart.js";
import { displayUserPanel } from "./reservation.js";
import { loadAbout } from "./about.js";
import { loadContact } from "./contact.js";
import { jwtDecode } from "jwt-decode";
import flatpickr from "flatpickr";
import "./css.css";
document.addEventListener("DOMContentLoaded", initSite);
function initSite() {
  initPopups();
  loadHome();
  checkUserStatus();
  initButtons();
}
function initButtons() {
  document.getElementById("home").addEventListener("click", loadHome);
  document.getElementById("cars").addEventListener("click", loadCars);
  document.getElementById("cart").addEventListener("click", displayCart);
  document.getElementById("about").addEventListener("click", loadAbout);
  document.getElementById("contact").addEventListener("click", loadContact);
  document
    .getElementById("account")
    .addEventListener("click", displayUserPanel);
}

function checkUserStatus() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("Użytkownik nie jest zalogowany.");
    return;
  }
  try {
    const user = jwtDecode(token);
    console.log(`Zalogowany użytkownik: ${user.email}`);
    showLoggingState();
  } catch (error) {
    console.error("Błąd podczas weryfikacji tokena:", error);
    localStorage.removeItem("token");
  }
}
function showLoggingState() {
  document.getElementById("signup").classList.toggle("hidden");
  document.getElementById("login").classList.toggle("hidden");
  document.getElementById("logout").classList.toggle("hidden");
  document.getElementById("cart").classList.toggle("hidden");
  document.getElementById("account").classList.toggle("hidden");
}

logout.addEventListener("click", userLogout);
function userLogout() {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
}
