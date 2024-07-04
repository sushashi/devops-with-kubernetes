const express = require('express')
const app = express()
const { Pool } = require('pg')

PORT = process.env.PORT || 3333

let pool

// const timer = (ms) => new Promise(res => setTimeout(res, ms))

const initDb = async () => {
    const psql = new Pool();

    // const psql = new Pool({
    //     host: "127.0.0.1",
    //     port: 5432,
    //     user: "postgres",
    //     password: "test"
    // })

    psql.on('error', (err, client) => {
        console.error('Unexpected error on database')
      })

    return psql
}

const getCounter = async (req, res) => {
    result = await pool.query('SELECT COUNT(*) FROM counter')
     
    console.log('Actual counter: ', result.rows[0].count)
    return Number(result.rows[0].count)
}

const saveCounter = async () => {
    result = await pool.query('INSERT INTO counter(count) VALUES(1)')
    console.log('Inserted a value')
}

app.get("/pingpong", async (req, res) => {
    try{
        counter = await getCounter()
        res.status(200).send("pong " + (counter+1) )
        saveCounter()
    } catch (err) {
        console.log('Error connection to database')
        res.status(503).send('Error connection to database')
    }
})

app.get("/count", async (req, res) => {
    try{
        counter = await getCounter()
        res.send("" + counter)
    } catch {
        console.log('Error connection to database')
        res.status(503).send('Error connection to database')
    }
})

app.get("/pingz", async (_, res) => {
    try {
        await getCounter()
        res.status(200).send("pongZ!")
    } catch {
        res.status(500).send("Database not ready!")
    }
})

app.get("/")
 
app.listen(PORT, () => {
    console.log("Ping pong server started on port", PORT)
    initDb().then(cl => pool = cl)
})