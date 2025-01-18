import express from "express";
import "dotenv/config";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let conn = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: "root",
  password: process.env.PASSWORD || "",
  database: process.env.NAME,
});

app.get("/", (req, res) => {
  res.send("Witaj na stronie głównej!");
});
//GETTERY WSZYSTKIEGO

app.get("/users", (req, res) => {
  conn.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;

    res.json(results);
  });
});
app.get("/cars", (req, res) => {
  conn.query("SELECT * from cars", (err, results) => {
    if (err) throw err;
    return res.json(results);
  });
});

//LOGOWANIE I REJESTRACJA

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request:", req.body);
  conn.query("SELECT * FROM USERS WHERE EMAIL = ?", [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const user = result[0];
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.json({ id: user.id, email: user.email });
  });
});
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  console.log("Received register request:", req.body);
  conn.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Błąd serwera");
    }

    if (results.length > 0) {
      return res.status(400).send("Użytkownik o takim e-mailu już istnieje");
    }
    conn.query(
      "INSERT INTO USERS (email, password) VALUES (?, ?)",
      [email, password],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database error" });
        }
        const id = result.insertId;
        return res.json({ id: id, email: email });
      }
    );
  });
});

//KOSZYK

app.post("/add-to-cart", (req, res) => {
  console.log("Dane z ciała zapytania:", req.body);

  const { userID, productID, quantity } = req.body;
  console.log(userID);
  console.log(productID);
  console.log(quantity);
  if (!userID) {
    return res.status(400).json({ error: "Brak ID użytkownika" });
  }

  conn.query(
    "SELECT * FROM carts WHERE user_id = ?",
    [userID],
    (err, result) => {
      if (err) return res.status(500).send("Błąd serwera");

      if (result.length === 0) {
        conn.query(
          "INSERT INTO carts (user_id) VALUES (?)",
          [userID],
          (err, result) => {
            if (err)
              return res.status(500).send("Błąd podczas tworzenia koszyka");

            const cartId = result.insertId;
            addItemToCart(cartId, productID, quantity, res);
          }
        );
        console.log(result);
      } else {
        const cartId = result[0].id;
        addItemToCart(cartId, productID, quantity, res);
        console.log(result);
      }
    }
  );
});

function addItemToCart(cartId, productId, quantity, res) {
  conn.query(
    "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?",
    [cartId, productId],
    (err, result) => {
      if (err) return res.status(500).send("Błąd serwera");

      if (result.length > 0) {
        return res.status(400).json({
          error: "Produkt już istnieje w koszyku. Nie można dodać go ponownie.",
        });
      } else {
        conn.query(
          "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
          [cartId, productId, quantity],
          (err) => {
            if (err) {
              return res
                .status(500)
                .send("Błąd podczas dodawania przedmiotu do koszyka");
            }
            res
              .status(200)
              .json({ message: "Produkt został dodany do koszyka" });
          }
        );
      }
    }
  );
}

app.get("/cart/:userId", (req, res) => {
  const userId = req.params.userId;

  conn.query(
    `
      SELECT ci.product_id, ci.quantity, ca.brand, ca.price_per_day
      FROM cart_items ci
      JOIN cars ca ON ci.product_id = ca.id
      JOIN carts c ON ci.cart_id = c.id
      WHERE c.user_id = ?`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).send("Błąd serwera");

      res.json(result);
    }
  );
});

app.post("/cart/makeReservation", (req, res) => {
  const { userID, carID, start_date, end_date, status, comments } = req.body;
  console.log(req.body);
  conn.query(
    `SELECT * from reservations where car_id = ?`,
    [carID],
    (err, result) => {
      if (err) return res.status(500).send("Błąd serwera");

      if (result.length > 0) {
        return res.status(400).send("Auto jest juz zarezerwowane");
      }
      conn.query(
        `INSERT INTO reservations (user_id, car_id, start_date, end_date, status, comments)
    VALUES (?, ?, ?, ?, ?, ?)`,
        [userID, carID, start_date, end_date, status, comments],
        (err) => {
          if (err) {
            return res
              .status(500)
              .send("Błąd podczas dodawania przedmiotu do koszyka");
          }
          res.status(200).json({ message: "Rezerwacja zostala wyslana" });
        }
      );
    }
  );
});

app.get("/reservation/:userId", (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  conn.query(
    `SELECT * from reservations WHERE user_id = ?`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).send("Błąd serwera");
      res.json(result);
    }
  );
});

app.get("/cars/:carID", (req, res) => {
  const carID = req.params.carID;
  console.log("XD" + carID);
  conn.query(`SELECT * from cars where id = ?`, [carID], (err, result) => {
    if (err) return res.status(500).send("Błąd");
    console.log(result);
    res.json(result);
  });
});

app.delete("/cart/clear/:userID", (req, res) => {
  const userID = req.params.userID;

  const query = `DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = ?)`;

  conn.query(query, [userID], (err, result) => {
    if (err) {
      return res.status(500).send("Błąd serwera podczas czyszczenia koszyka");
    }
    res.status(200).send("Koszyk został wyczyszczony");
  });
});

// Usunięcie pojedynczego przedmiotu z koszyka
app.delete("/cart/removeItem/:productId", (req, res) => {
  const productId = req.params.productId;

  // Kwerenda SQL do usunięcia przedmiotu o podanym product_id z cart_items
  const query = `DELETE FROM cart_items WHERE product_id = ?`;

  conn.query(query, [productId], (err, result) => {
    if (err) {
      console.error("Błąd podczas usuwania przedmiotu:", err);
      return res.status(500).json({ message: "Błąd serwera" });
    }

    // Jeżeli przedmiot został usunięty
    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Przedmiot został usunięty z koszyka" });
    } else {
      return res
        .status(404)
        .json({ message: "Nie znaleziono przedmiotu w koszyku" });
    }
  });
});
//HOST
app.listen(3000, () => {
  console.log("Serwer działa na porcie 3000");
});
