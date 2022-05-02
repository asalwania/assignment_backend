const express = require("express")
const cors = require("cors")
const path = require('path')
const app = express()

const user = require("./routes/user")

const dir = path.join(__dirname,'public')
// Route import

app.use(express.json());
app.use(cors())
app.use("/images",express.static("public"))
app.use("/api/user", user)

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });


// app.use(express.static(path.join(__dirname, "../frontend/build/index.html")));

module.exports = app;
