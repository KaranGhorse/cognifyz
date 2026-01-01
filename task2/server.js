const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let tempDB = [];

app.post("/submit", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({msg:"All fields are required!"})
    }
    
    if (password.length < 6) {
        return res.status(400).json({msg:"Password too short!"})
    }

    const user = { name, email, password };
    tempDB.push(user);

    console.log("Stored Data:", tempDB);

    res.send("Form submitted successfully!");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
