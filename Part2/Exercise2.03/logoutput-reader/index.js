const express = require('express')
const app = express()
const fs = require('fs')
const fetch = require('node-fetch')

PORT =  process.env.PORT || 3333

let theString
let counterPong = 0

const getString = () => {
    fs.readFile('./files/text.txt', "utf8", (err, data) => {
        if(err){
            console.log("Error reading data")
            return;
        }

        theString = data

        console.log(theString)
    })

    // fs.readFile('./files/counter.txt', (err, data) => {
    //     if(err){
    //         console.log("Error reading counter")
    //         return
    //     }
    //     counterPong = data
    // })
}

const fetchCounter = async() => {
    let url = 'http://pingpong-svc:1234/count'
    try{
        let response = await fetch(url)
        let body = await response.text()
        return body
    } catch (e) {
        console.log(e)
    }
}

const run = () => {
    getString()
    setInterval( () => {
        getString()
    }, 5000)
}

app.get("/", async (req, res) => {
    counterPong = await fetchCounter()
    res.set('Content-Type', 'text/html')
    res.send(theString + '.<br>' + "Ping / Pongs: " + counterPong)

})

app.listen(PORT, () => {
    console.log("Reader Server started in port", PORT)
})

run()