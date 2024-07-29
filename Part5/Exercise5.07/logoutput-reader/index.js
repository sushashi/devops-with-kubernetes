const express = require('express')
const app = express()
const fs = require('fs')
const fetch = require('node-fetch')

PORT =  process.env.PORT_CONTAINER || 3333
MSG = process.env.MSG
FETCH_URL = process.env.FETCH_URL || 'http://pingpong-svc:1234/count'


let fileConfigText
let theString
let counterPong = 0

const getString = () => {
    fs.readFile('./files/text.txt', "utf8", (err, data) => {
        if(err){
            console.log("Error reading data")
            return;
        }
        theString = data
        // console.log(theString)
    })
}

const getConfigText = async () => {
    let tt = await fs.promises.readFile('./fromconfigmap/information.txt', "utf8")
    return tt
}

const fetchCounter = async() => {
    let url = FETCH_URL
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
    fileConfigText = await getConfigText()

    res.set('Content-Type', 'text/html')
    res.send('file content: '+ fileConfigText + '<br>' + 'env variable: MESSAGE=' + MSG + '<br>' + theString + '.<br>' + "Ping / Pongs: " + counterPong)
})

app.listen(PORT, () => {
    console.log("Reader Server started in port", PORT)
})

run()