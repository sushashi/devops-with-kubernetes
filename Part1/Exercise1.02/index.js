const express = require('express')
const app = express()

PORT = process.env.PORT

app.listen(PORT, () => {
    console.log("Server started in port", PORT)
})
