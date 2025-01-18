export const initPopups = () => {
  let signup = document.getElementById("signup");
  let signpopup = document.getElementById("registerPopup");
  let registerclosebtn = document.querySelector(".register-close-btn");

  signup.addEventListener("click", () => {
    signpopup.classList.add("popup-show");
  });

  registerclosebtn.addEventListener("click", () => {
    signpopup.classList.remove("popup-show");
    resetPopups();
  });
  function resetPopups() {
    document.getElementById("ema").classList.remove("hidden");
    document.getElementById("passw").classList.add("hidden");
    document.getElementById("signerrorMessage").textContent = "";
    document.getElementById("signemail").value = "";
    document.getElementById("signpassword").value = "";
    document.getElementById("signconfirmpassword").value = "";
    document.getElementById("loginerrorMessage").textContent = "";
    document.getElementById("loginemail").value = "";
    document.getElementById("loginpassword").value = "";
  }
  let loggin = document.getElementById("login");
  let loginpopup = document.getElementById("loginPopup");
  let loginclosebtn = document.querySelector(".login-close-btn");

  function swapPopups() {
    if (signpopup.classList.contains("popup-show")) {
      signpopup.classList.remove("popup-show");
      resetPopups();
      loginpopup.classList.add("popup-show");
    } else {
      signpopup.classList.add("popup-show");
      resetPopups();
      loginpopup.classList.remove("popup-show");
    }
  }

  let signalr = document.getElementById("signalr");
  let loginalr = document.getElementById("loginalr");

  signalr.addEventListener("click", swapPopups);
  loginalr.addEventListener("click", swapPopups);

  loggin.addEventListener("click", () => {
    loginpopup.classList.add("popup-show");
  });

  loginclosebtn.addEventListener("click", () => {
    resetPopups();
    loginpopup.classList.remove("popup-show");
  });
  document.getElementById("register-btn").addEventListener("click", (event) => {
    event.preventDefault();
    let email = document.getElementById("signemail");
    let signpassw = document.getElementById("passw");
    let emaildis = document.getElementById("ema");
    let password = document.getElementById("signpassword");
    let confirmpassword = document.getElementById("signconfirmpassword");
    let errorMessage = document.getElementById("signerrorMessage");
    errorMessage.textContent = "";
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(email.value)) {
      errorMessage.textContent = "Invalid email";
      return;
    }
    if (email.value && signpassw.classList.contains("hidden")) {
      console.log("CO");
      signpassw.classList.remove("hidden");
      emaildis.classList.add("hidden");
      return;
    }
    if (password.value.length < 6) {
      errorMessage.textContent = "Hasło musi zawierać conajmniej 6 znaków!";
      console.log("??????");
      return;
    }
    if (confirmpassword.value !== password.value) {
      errorMessage.textContent = "Hasła nie są takie same!";
      return;
    }
    const data = {
      email: email.value,
      password: password.value,
    };
    register(data);
  });

  document.getElementById("login-btn").addEventListener("click", () => {
    let email = document.getElementById("loginemail");
    let password = document.getElementById("loginpassword");
    if (!email.value || !password.value) {
      document.getElementById("loginerrorMessage").textContent =
        "Proszę wypełnić wszystkie pola!";
      return;
    }
    const data = {
      email: email.value,
      password: password.value,
    };
    login(data);
  });
  async function getUsers() {
    try {
      const response = await fetch("http://localhost:3000/users");
      if (!response.ok) {
        throw new Error("Error");
      }
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function login(data) {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("User not found");
      }
      const result = await response.json();
      console.log(`Login successful: ${JSON.stringify(result)}`);
      const { id, email } = result;
      localStorage.setItem("user", JSON.stringify({ id, email }));
      window.location.href = "/index.html";
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  async function register(data) {
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("User is already in database");
      }
      const result = await response.json();
      console.log(`Register successful: ${JSON.stringify(result)}`);
      const { id, email } = result;
      localStorage.setItem("user", JSON.stringify({ id, email }));
      window.location.href = "/index.html";
    } catch (error) {
      console.error("Error during register:", error);
    }
  }
};
