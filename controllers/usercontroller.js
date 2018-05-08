const axios = require("axios");

let getusers = (req, res) => {
    axios.get("http://localhost:3000/users").then((result) => {
        res.json(result.data)
    })
}

module.exports = {
    getusers: getusers
}