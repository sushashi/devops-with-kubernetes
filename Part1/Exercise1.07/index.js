const express = require('express')
const app = express()

PORT = process.env.PORT || "3333"

const generateString = () => {
    let str =  Math.random().toString(36).slice(2, 10);
    for (let i = 0; i < 4; i++){
        str += "-" + Math.random().toString(36).slice(2, 6);
    }
    str += "-" + Math.random().toString(36).slice(2, 14);

    return str
}

const printOut = (str) => {
    date = new Date().toISOString()
    console.log(date + ": " + str)
}

string_mem = generateString()

const run = () => {
    str = string_mem

    printOut(str)
    setInterval(() => {
        printOut(str)
    }, 5000)
}

app.get("/", (req, res) => {
    timestamp = new Date().toISOString()
    stringout = string_mem
    res.send(timestamp + ": " + stringout)
})

app.listen(PORT, () => {
    console.log("Server started in port", PORT)
})

run()