const express = require('express')
const app = express()
const fs = require('fs')

PORT =  process.env.PORT || 3333

let theString
let counterPong

const getString = () => {
    fs.readFile('./files/text.txt', (err, data) => {
        if(err){
            console.log("Error reading data")
            return;
        }

        theString = data

        console.log(theString)
    })

    fs.readFile('./files/counter.txt', (err, data) => {
        if(err){
            console.log("Error reading counter")
            return
        }
        counterPong = data
    })
}

const run = () => {
    getString()
    setInterval( () => {
        getString()
    }, 5000)
}

app.get("/", (req, res) => {
    res.set('Content-Type', 'text/html')
    res.send(theString + '.<br>' + "Ping / Pongs: " + counterPong)

})

app.listen(PORT, () => {
    console.log("Reader Server started in port", PORT)
})

run()