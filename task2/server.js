const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let tempDB = [];

app.get("/", (req, res) => {   
    res.sendFile(__dirname + "/public/index.html");
})

app.post("/submit", (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.redirect("/result.html?status=error&msg=All fields are required");
    }

    if (password.length < 6) {
        return res.redirect("/result.html?status=error&msg=Password too short");
    }

    const existingUser = tempDB.find(user => user.email === email);
    if (existingUser) {
        return res.redirect("/result.html?status=error&msg=Email already exists");
    }

    const user = { name, email, password };
    tempDB.push(user);

    console.log("Stored Data:", tempDB);

    res.redirect(`/result.html?status=success&name=${name}&email=${email}`);
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
