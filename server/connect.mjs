import express from "express";
import "dotenv/config";
import mysql from "mysql2";
import cors from "cors";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Brak tokena" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Nieprawidłowy token" });
    req.user = user;
    next();
  });
}

export { authenticateToken };

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    conn.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) return res.status(500).send("Błąd serwera");

        if (result.length === 0) {
          return res
            .status(401)
            .json({ error: "Nieprawidłowy e-mail lub hasło" });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res
            .status(401)
            .json({ error: "Nieprawidłowy e-mail lub hasło" });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).send("Wystąpił błąd serwera podczas logowania.");
  }
});
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  console.log("Received register request:", req.body);
  conn.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Błąd serwera");
      }

      if (results.length > 0) {
        return res.status(400).send("Użytkownik o takim e-mailu już istnieje");
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      conn.query(
        "INSERT INTO USERS (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
          }
          const id = result.insertId;
          const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          return res.json({ token });
        }
      );
    }
  );
});

//KOSZYK

app.post("/add-to-cart", authenticateToken, (req, res) => {
  console.log("Dane z ciała zapytania:", req.body);

  const { productID, quantity } = req.body;
  const userID = req.user.id;

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

app.get("/cart", authenticateToken, (req, res) => {
  const userId = req.user.id;

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

app.post("/cart/makeReservation", authenticateToken, (req, res) => {
  const { carID, start_date, status, comments } = req.body;
  const userID = req.user.id;
  console.log("Rezerwacja dane wejściowe:", {
    carID,
    start_date,
    status,
    comments,
    userID,
  });
  console.log(req.body);
  conn.query(
    `SELECT * from reservations where car_id = ? AND user_id = ?`,
    [carID, userID],
    (err, result) => {
      if (err) {
        console.error("Błąd serwera podczas sprawdzania rezerwacji:", err);
        return res.status(500).json({ error: "Błąd serwera" });
      }
      if (result.length > 0) {
        return res.status(400).send("Auto jest juz zarezerwowane");
      }
      conn.query(
        `INSERT INTO reservations (user_id, car_id, start_date, end_date, status, comments)
    VALUES (?, ?, ?, NULL, ?, ?)`,
        [userID, carID, start_date, status, comments],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .send("Błąd podczas dodawania przedmiotu do koszyka");
          }
          conn.query(
            `DELETE FROM available_dates WHERE car_id = ? AND available_date = ?`,
            [carID, start_date],
            (err, deleteResult) => {
              if (err) {
                console.error(
                  "Błąd podczas usuwania dostępnej daty z tabeli:",
                  err
                );
                return res.status(500).send("Błąd serwera");
              }

              console.log("Usunięto datę z dostępnych dat:", deleteResult);
            }
          );
          console.log("Rezerwacja została pomyślnie dodana:", result);
          res.status(200).json({ message: "Rezerwacja zostala wyslana" });
        }
      );
    }
  );
});

app.get("/reservation", authenticateToken, (req, res) => {
  const userId = req.user.id;
  console.log(userId);
  conn.query(
    `SELECT * from reservations WHERE user_id = ?`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).send("Błąd serwera");
      console.log("Reservation query result:", result);
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

app.delete("/cart/clear", authenticateToken, (req, res) => {
  const userID = req.user.id;

  const query = `DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = ?)`;

  conn.query(query, [userID], (err, result) => {
    if (err) {
      return res.status(500).send("Błąd serwera podczas czyszczenia koszyka");
    }
    res.status(200).send("Koszyk został wyczyszczony");
  });
});

app.delete("/cart/removeItem/:productId", (req, res) => {
  const productId = req.params.productId;

  const query = `DELETE FROM cart_items WHERE product_id = ?`;

  conn.query(query, [productId], (err, result) => {
    if (err) {
      console.error("Błąd podczas usuwania przedmiotu:", err);
      return res.status(500).json({ message: "Błąd serwera" });
    }

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
app.get("/cars/:carID/available-dates", authenticateToken, (req, res) => {
  const carID = req.params.carID;

  conn.query(
    `SELECT available_date FROM available_dates WHERE car_id = ? ORDER BY available_date ASC`,
    [carID],
    (err, result) => {
      if (err) {
        console.error("Błąd podczas pobierania dostępnych dat:", err);
        return res.status(500).json({ message: "Błąd serwera" });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "Brak dostępnych dat dla tego samochodu." });
      }

      res.json(result.map((row) => row.available_date));
    }
  );
});
//HOST
app.listen(3000, () => {
  console.log("Serwer działa na porcie 3000");
});
