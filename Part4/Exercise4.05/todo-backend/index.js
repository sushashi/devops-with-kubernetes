const express = require('express')
const cors = require('cors')
const app = express()
const { Pool } = require('pg')

app.use(cors())
app.use(express.json())

PORT = process.env.PORT || 4000

let pool

const initDb = async () => {
    // const psql = new Pool();
    const psql = new Pool({
        user: 'postgres',
        password: 'test',
        host: '127.0.0.1',
        port: '5432'
    })

    psql.on('error', (err, client) => {
        console.error('Unexpected error on database')
    })
    return psql
}

const getTodos = async () => {
    let result = await pool.query('SELECT * FROM todos')
    console.log('Getting todos: ' + result.rows)
    output = result.rows
    return output
}

const addTodo = async (todo) => {
    const query = {
        text: 'INSERT INTO todos(todo) VALUES($1)',
        values: [todo]
    }
    pool.query(query)
}

const doneTodo = async (todo_id) => {
    let query_id = {
        text: 'SELECT id FROM todos WHERE id = $1',
        values: [todo_id]
    }
    let res_id = await pool.query(query_id)

    // console.log(res_id.rows[0].id)

    if (!(res_id.rows[0]) || res_id.rows[0].id != todo_id) {
        throw new Error('todo id not found!')
    } else {
        const query = {
            text: 'UPDATE todos SET done = true WHERE id = $1',
            values: [todo_id]
        }
        pool.query(query)
    }
}

app.put("/todos/:id", async (req, res) => {
    try {
        let todo_id = req.params.id
        console.log(todo_id)
        await doneTodo(todo_id)
        res.status(200).send('Updated')
    } catch(e) {
        // console.log(e.message)
        res.status(400).send('Unexpected Error: '+ String(e.message))
    }
})

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

app.get("/", (_, res) => {
    res.send("Ok GKE ?")
})

app.listen(PORT, () => {
    console.log("Todos Server started on port", PORT)
    initDb().then(c => pool = c)
})