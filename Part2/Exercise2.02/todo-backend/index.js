const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

PORT = process.env.PORT || 4000

let todos = ['Todo 1', 'Todo 2']

app.get("/todos", (req, res) => {
    res.json({'todos' : todos})
})

app.post("/todos", (req, res) => {
    todos.push(req.body.todo)
    res.send(req.body.todo)
})

app.listen(PORT, () => {
    console.log("Todos Server started on port", PORT)
})