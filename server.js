const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:4200" }));

const projectsFilePath = path.join(__dirname, "data", "projects.json");
const contactsFilePath = path.join(__dirname, "data", "contacts.json");

// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "********" : "MISSING");
// console.log("DB_DATABASE:", process.env.DB_DATABASE);
// console.log("DB_PORT:", process.env.DB_PORT);

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "port_db",
//     port: 3310
// });

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: process.env.DB_PORT
// });

// db.connect((err) => {
//     if (err) {
//         console.error("Database connection failed: " + err.message);
//     } else {
//         console.log("Connected to MySQL Database");
//     }
// });

// app.get("/", (req, res) => {
//     res.send("Portfolio API is running!");
// });

// app.get("/projects", (req, res) => {
//     console.log("projects");
//     db.query("SELECT * FROM projects", (err, results) => {
//         if (err) return res.status(500).send(err);
//         res.json(results);
//     });
// });

// app.post("/contact", (req, res) => {
//     const { name, email, message } = req.body;
//     const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
//     db.query(sql, [name, email, message], (err, result) => {
//         if (err) return res.status(500).send(err);
//         res.json({ success: true, message: "Message sent successfully!" });
//     });
// });

app.get("/projects", (req, res) => {
    fs.readFile(projectsFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).send("Error reading projects file.");
        res.json(JSON.parse(data));
    });
});

app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;

    // Read existing contacts
    fs.readFile(contactsFilePath, "utf8", (err, data) => {
        if (err) return res.status(500).send("Error reading contacts file.");

        let contacts = JSON.parse(data);
        contacts.push({ id: contacts.length + 1, name, email, message, createdAt: new Date() });

        // Write back to contacts.json
        fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2), "utf8", (err) => {
            if (err) return res.status(500).send("Error saving contact.");
            res.json({ success: true, message: "Message sent successfully!" });
        });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
