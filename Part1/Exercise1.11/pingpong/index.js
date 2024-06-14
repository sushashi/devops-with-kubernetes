const express = require('express')
const app = express()
const fs = require('fs')

PORT = process.env.PORT || 3333

let counter = 0

const createCounter = () => {
    if(!fs.existsSync('./files')){
        fs.mkdirSync('./files')
    }
    fs.writeFile('./files/counter.txt', String(0), err => {
        if(err){
            console.log("Error creating counter")
        }
    })
}

const getCounter = () => {
    fs.readFile('./files/counter.txt', (err, data) => {
        if(err){
            console.log("PingPong: Error loading counter")
            return
        }
        counter = Number(data)
    })
}

const saveCounter = () => {
    if(!fs.existsSync('./files')){
        fs.mkdirSync('./files')
    }

    fs.writeFile('./files/counter.txt', String(counter), err => {
        if(err){
            console.log("Error writing counter")
        }
    })
}

app.get("/pingpong", (req, res) => {
    getCounter()
    counter += 1
    res.send("pong " + counter)
    saveCounter()
})

app.listen(PORT, () => {
    console.log("Ping pong server started on port", PORT)
    createCounter()
})