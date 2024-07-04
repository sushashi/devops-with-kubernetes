const express = require('express')
const cors = require('cors')
const app = express()
const { Pool } = require('pg')

// const client = require('pg').Client
// const psql = new client()

// const psql = new client({
//     user: 'postgres',
//     password: 'test',
//     host: '127.0.0.1',
//     port: '5432'
// })

app.use(cors())
app.use(express.json())

PORT = process.env.PORT || 4000

let pool

const initDb = async () => {
    const psql = new Pool();
    psql.on('error', (err, client) => {
        console.error('Unexpected error on database')
    })
    return psql
}

// const  connectDatabase = async () => {
//     await psql.connect()
//     console.log('Connected to database')
// }

const getTodos = async () => {
    let result = await pool.query('SELECT todo FROM todos')
    output = result.rows.map( t => t.todo )
    return output
}

const addTodo = async (todo) => {
    const query = {
        text: 'INSERT INTO todos(todo) VALUES($1)',
        values: [todo]
    }
    pool.query(query)
}

app.get("/todos", async (req, res) => {
    try {
        let todos = await getTodos()
        res.json({'todos' : todos})
    } catch {
        res.status(503).send('Unexpected Error')
    }
})

app.post("/todos", async (req, res) => {
    try {
        let todo = req.body.todo
        console.log('Adding a todo: "'+ todo + '"')
        if (todo.length > 140) {
            console.log('Todo exceeds 140 characters (' + todo.length + ' characters). Aborted')
            res.status(400).send('Todo exceeds 140 characters (' + todo.length + ' characters).')
        } else {
            await addTodo(req.body.todo)
            console.log('... added')
            res.status(200).send(req.body.todo)
        }
    } catch {
        res.status(503).send('Unexpected Error')
    }
})

app.get("/backendz", async (req, res) => {
    try {
        await getTodos()
        res.status(200).send('Database ready')
    } catch {
        res.status(503).send('Database not ready')
    }
} )

app.listen(PORT, () => {
    console.log("Todos Server started on port", PORT)
    initDb().then(c => pool = c)
})