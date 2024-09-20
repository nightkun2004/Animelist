const express = require("express")
const router = express.Router()

const { getHomeView } = require("../Controllers/indexRouter")
const { getListAnimeView } = require("../Controllers/listAnimeController")

router.get("/", getHomeView)
router.get("/list/anime/:urlslug", getListAnimeView)    

module.exports = router