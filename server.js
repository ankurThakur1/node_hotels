require("dotenv").config();
const express = require("express");
const app = express();
const connectToDB = require("./db");
const bodyParser = require("body-parser");
const personRouter = require("./routes/personRoutes");
const menuRouter = require("./routes/menuRoutes");
const passport = require("./auth");
const Person = require("./models/Person");


connectToDB();

app.use(bodyParser.json());


// middleware
const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} Request made to: ${req.originalUrl}`);
    next();
}

app.use(logRequest);


app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate("local", { session: false });  // use this middleware anywhere in routes like in [personRouter]

app.get("/", (req, res) => {
    res.send("Welcome to our hotel");
});




// app.use("/person", localAuthMiddleware, personRouter);
app.use("/person", personRouter);
app.use("/menu", menuRouter);









const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running, Port: ${PORT}`);
});

// 1:59 / 38:18 14

// as a freelance web designer or developer, weather i have to say customer that can i build your website on plain html css and javascirpt or on react or next or angular
// how to explain JWT concept to interviewer