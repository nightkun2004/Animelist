const axios = require("axios")

const getListAnimeView = async (req,res) => {
    const { urlslug } = req.params;
    const apiKey = '1774bcb5-9e11-4ee0-b93d-a970c1da34fb'; 
    try {
        const response = await axios.get(`https://ani-night.online/api/v2/anime/info/${urlslug}`, {
            headers: {
                'x-api-key': apiKey
            }
        });

        const animeData = response.data.anime;
        // console.log(animeData)
        res.render("./pages/list", { active: "Animelist", apiKey, animeData})
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    getListAnimeView
}