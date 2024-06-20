const express = require('express')
const cors = require('cors')
const app = express()

const client = require('pg').Client
const psql = new client()

// const psql = new client({
//     user: 'postgres',
//     password: 'test',
//     host: '127.0.0.1',
//     port: '5432'
// })

app.use(cors())
app.use(express.json())

PORT = process.env.PORT || 4000

const  connectDatabase = async () => {
    await psql.connect()
    console.log('Connected to database')
}

const getTodos = async () => {
    let result = await psql.query('SELECT todo FROM todos')
    output = result.rows.map( t => t.todo )
    return output
}

const addTodo = async (todo) => {
    const query = {
        text: 'INSERT INTO todos(todo) VALUES($1)',
        values: [todo]
    }
    psql.query(query)
}

app.get("/todos", async (req, res) => {
    let todos = await getTodos()
    res.json({'todos' : todos})
})

app.post("/todos", async (req, res) => {
    await addTodo(req.body.todo)
    res.send(req.body.todo)
})

app.listen(PORT, () => {
    console.log("Todos Server started on port", PORT)
    connectDatabase()
})