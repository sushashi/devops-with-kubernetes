const express = require('express')
const app = express()
const fs = require('fs')
const fetch = require('node-fetch')

PORT = process.env.PORT || 2000

const sinceLastTime = async () => {
    let howLong = await fs.promises.readFile("./files/lasttime.txt", "utf-8")
    return (Date.now() - howLong)/1000
}

const fetchImage = async () => {
    const url = "https://picsum.photos/1200"
    await fetch(url).then((res) => {
        res.body.pipe(fs.createWriteStream("./files/image.jpg"))
        let time = Date.now()
        fs.writeFile("./files/lasttime.txt", String(time), err => {
            if(err){
                console.log("Error fetching new image")
            }
            console.log("Fetched new image")
        })
    })
}

app.get("/", async (req, res) => {
    let howLong = await sinceLastTime()
    console.log(howLong + " seconds since last fetch")

    if (howLong > 3600 || !fs.existsSync('./files/image.jpg')){
        await fetchImage()
    }
    res.sendFile('./static/index.html', {root: __dirname })
})

app.listen(PORT, () => {
    console.log("Server started on port", PORT)

    if(!fs.existsSync("./files/lasttime.txt")) {
        fs.writeFile("./files/lasttime.txt", String(Date.now()), err => {
            if(err){
                console.log("Error writing lasttime.txt")
            }
            console.log("lasttime.txt created")
        })
    }
})

app.use(express.static('files'))
app.use(express.static('static'))