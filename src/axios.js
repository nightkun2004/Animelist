const axios = require("axios")
require("dotenv")

const instance = axios.create({
    baseURL: process.env.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default instance;