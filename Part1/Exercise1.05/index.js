const express = require('express')
const app = express()

PORT = process.env.PORT

app.get("/", (req, res) => {
    res.send('Hello world')
})

app.listen(PORT, () => {
    console.log("Server started in port", PORT)
})
