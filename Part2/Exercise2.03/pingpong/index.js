const express = require('express')
const app = express()
const fs = require('fs')

PORT = process.env.PORT || 3333

let counter = 0

const createCounter = () => {
    if(!fs.existsSync('./counter')){
        fs.mkdirSync('./counter')
    }
    if(!fs.existsSync('./counter/counter.txt')){
        fs.writeFile('./counter/counter.txt', String(0), err => {
            if(err){
                console.log("Error creating counter")
            }
        })
        console.log("counter.txt created and init to 0")
    }
}

const getCounter = async () => {
    cc = await fs.promises.readFile('./counter/counter.txt', (err, data) => {
        if(err){
            console.log("PingPong: Error loading counter")
            return
        }
    })
    return Number(cc)
}

const saveCounter = () => {
    if(!fs.existsSync('./counter')){
        fs.mkdirSync('./counter')
    }

    fs.writeFile('./counter/counter.txt', String(counter), err => {
        if(err){
            console.log("Error writing counter")
        }
    })
}

app.get("/pingpong", async (req, res) => {
    counter = await getCounter()
    counter += 1
    res.send("pong " + counter)
    saveCounter()
})

app.get("/count", async (req, res) => {
    counter = await getCounter()
    // console.log("COUNTER: ", counter)
    res.send(""+counter)
})
 
app.listen(PORT, () => {
    console.log("Ping pong server started on port", PORT)
    createCounter()
})