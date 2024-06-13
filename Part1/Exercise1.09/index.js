const express = require('express')
const app = express()

PORT = process.env.PORT || 3333

let counter = 0

app.get("/pingpong", (req, res) => {
    res.send("pong " + counter)
    counter += 1
})

app.listen(PORT, () => {
    console.log("Ping pong server started in port", PORT)
})