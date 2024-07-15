const express = require('express')
const cors = require('cors')
const app = express()
const { Pool } = require('pg')
const { connect, StringCodec } = require('nats')

app.use(cors())
app.use(express.json())

PORT = process.env.PORT || 4000

let pool, nats_nc, nats_sc, nats_sub

const connectNats = async () => {
    try {
        const nc = await connect({servers: process.env.NATS_URL || "nats://127.0.0.1:4222"})
        console.log(`NATS: connected to ${nc.getServer()}`);
        const sc = StringCodec()
        const sub = nc.subscribe('hello')
        return {nc, sc, sub}
    } catch (e) {
        console.log('Error connecting to NATS: \n', e)
    }
}

const initDb = async () => {
    let psql // switching between dev and prod
    if ( PORT == 4000 ){
        psql = new Pool({
            user: 'postgres',
            password: 'test',
            host: '127.0.0.1',
            port: '5432'
        })
    } else {
        psql = new Pool();
    }
    

    psql.on('error', (err, client) => {
        console.error('Unexpected error on database')
    })
    return psql
}

const getTodo = async (id) => {
    const query = {
        text: 'SELECT * FROM todos WHERE id = $1',
        values: [id] 
    }

    let result = await pool.query(query)
    return result.rows[0]
}

const getTodos = async () => {
    let result = await pool.query('SELECT * FROM todos')
    // console.log('Getting todos: ' + JSON.stringify(result.rows))
    output = result.rows
    return output
}

const addTodo = async (todo) => {
    const query = {
        name: 'fetch-user',
        text: 'INSERT INTO todos(todo) VALUES($1) RETURNING id',
        values: [todo]
    }
    const result = await pool.query(query)

    return await getTodo(result.rows[0].id)
}

const doneTodo = async (todo_id) => {
    try{
        let res = await getTodo(todo_id)
        console.log('RES ID: ', res.id)
        const query = {
            text: 'UPDATE todos SET done = true WHERE id = $1 RETURNING id',
            values: [res.id] // rows[0] undefined if not exists
        }
        const result = await pool.query(query)
        return await getTodo(result.rows[0].id)
    } catch {
        console.error('Error: todo id not found: ' + todo_id)
        throw new Error('todo id not found: ' + todo_id)
    }
}

app.put("/todos/:id", async (req, res) => {
    try {
        let todo_id = req.params.id
        console.log('Marking as done id:', todo_id)
        const payload = await doneTodo(todo_id)
        console.log('MARKED AS DONE: ', payload)
        
        nats_nc.publish('todos', JSON.stringify(payload))
        res.status(200).send(payload)
    } catch(e) {
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
            const payload = await addTodo(req.body.todo)
            console.log('NEW TODO ADDED: ', payload)

            nats_nc.publish('todos', JSON.stringify(payload))
            res.status(200).send(payload)
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
    connectNats().then(nats => {
        nats_nc = nats.nc
        nats_sc = nats.sc
        nats_sub = nats.sub
    })
})