const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:4200" }));

console.log("DB_HOST:", process.env.DATABASE_HOST);
console.log("DB_USER:", process.env.DATABASE_USER);
console.log("DB_PASSWORD:", process.env.DATABASE_PASSWORD ? "********" : "MISSING");
console.log("DB_DATABASE:", process.env.DATABASE_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "port_db",
//     port: 3310
// });

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.message);
    } else {
        console.log("Connected to MySQL Database");
    }
});

app.get("/", (req, res) => {
    res.send("Portfolio API is running!");
});

app.get("/projects", (req, res) => {
    console.log("projects");
    db.query("SELECT * FROM projects", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
    db.query(sql, [name, email, message], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ success: true, message: "Message sent successfully!" });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
