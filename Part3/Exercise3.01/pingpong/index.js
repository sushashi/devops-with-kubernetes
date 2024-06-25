const express = require('express')
const app = express()

const client = require('pg').Client
const psql = new client();

PORT = process.env.PORT || 3333

const connectDatabase = async () => {
    await psql.connect()
    console.log('Connected to database')
}

const getCounter = async (req, res) => {
    result = await psql.query('SELECT COUNT(*) FROM counter')
     
    console.log('Actual counter: ', result.rows[0].count)
    return Number(result.rows[0].count)
}

const saveCounter = async () => {
    result = await psql.query('INSERT INTO counter(count) VALUES(1)')
    console.log('Inserted a value')
}

app.get("/pingpong", async (req, res) => {
    counter = await getCounter()
    res.send("pong " + (counter+1) )
    saveCounter()
})

app.get("/count", async (req, res) => {
    counter = await getCounter()
    res.send("" + counter)
})
 
app.listen(PORT, () => {
    console.log("Ping pong server started on port", PORT)
    connectDatabase()
})