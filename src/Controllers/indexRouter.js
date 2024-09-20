

const getHomeView = async (req,res) => {
    try {
        res.render("./pages/index", { active: "Home"})
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    getHomeView
}