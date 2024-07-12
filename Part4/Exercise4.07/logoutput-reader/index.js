const express = require('express')
const app = express()
const fs = require('fs')
const fetch = require('node-fetch')

PORT =  process.env.PORT || 3334
MSG = process.env.MSG

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

const checkDb = async (req, res) => {
    let url = 'http://pingpong-svc:1234/count'
    // let url = 'http://127.0.0.1:3333/count'
    let response
    try {
        response = await fetch(url)
    } catch {
        res.status(503).send('Backend not ready (or database not ready)')
        return
    }

    if (response.status == 200){
        res.status(200).send('Ready!')
    } else {
        res.status(503).send('Database not ready!')
    }
}

app.get("/", async (req, res) => {
    counterPong = await fetchCounter()
    fileConfigText = await getConfigText()

    res.set('Content-Type', 'text/html')
    res.send('File Content: '+ fileConfigText + '<br>' + 'env variable: MESSAGE=' + MSG + '<br>' + theString + '.<br>' + "Ping / Pongs: " + counterPong)
})

app.get("/readerz", checkDb )

app.listen(PORT, () => {
    console.log("Reader Server started in port", PORT)
})

run()