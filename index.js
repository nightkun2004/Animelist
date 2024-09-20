const express = require("express")
const app = express()
const path = require("path")

require("dotenv").config();
const PORT = process.env.PORT || 7000;

const router = require("./src/router/main")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));


app.use(express.static(path.join(__dirname, 'src/assets')))
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.apiBaseUrl = process.env.API_BASE_URL;
    next();
});

app.use(router)

app.listen(PORT, () => {
    console.log(`Server in runing ${PORT}`)
})