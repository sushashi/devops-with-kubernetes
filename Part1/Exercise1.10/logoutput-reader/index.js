const express = require('express')
const app = express()
const fs = require('fs')

PORT =  process.env.PORT || 3333

let theString

const getString = () => {
    fs.readFile('./files/text.txt', (err, data) => {
        if(err){
            console.log("Error reading data")
            return;
        }

        hash = Math.random().toString(36).slice(2, 8);
        theString = hash + " - " + data

        console.log(theString)
    })
}

const run = () => {
    getString()
    setInterval( () => {
        getString()
    }, 5000)
}

app.get("/", (req, res) => {
    res.send(theString)
})

app.listen(PORT, () => {
    console.log("Reader Server started in port", PORT)
})

run()