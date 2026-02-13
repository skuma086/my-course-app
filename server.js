const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "adminsecretkey",
    resave: false,
    saveUninitialized: true
}));

// =============================
// SAVE USER DATA
// =============================
app.post("/save", (req, res) => {
    const { name, mobile, course } = req.body;

    if (!name || !mobile) {
        return res.json({ message: "Please fill all fields" });
    }

    const newUser = {
        name,
        mobile,
        course
    };

    const data = JSON.parse(fs.readFileSync("data.json"));
    data.push(newUser);

    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

    res.json({ message: "User registered successfully!" });
});

// =============================
// ADMIN LOGIN
// =============================
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "12345") {
        req.session.loggedIn = true;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// =============================
// GET ADMIN DATA (PROTECTED)
// =============================
app.get("/admin-data", (req, res) => {

    if (!req.session.loggedIn) {
        return res.status(403).json({ message: "Unauthorized access" });
    }

    const data = JSON.parse(fs.readFileSync("data.json"));
    res.json(data);
});

// =============================
// LOGOUT
// =============================
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login.html");
});

// =============================
// START SERVER (IMPORTANT LINE)
// =============================
app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on:");
    console.log(`Local: http://localhost:${PORT}`);
    console.log("Network: http://YOUR-IP:3000");
});
