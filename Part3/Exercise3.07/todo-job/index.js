const request = require('request')
const client = require('pg').Client
const psql = new client()

// const psql = new client({
//     user: 'postgres',
//     password: 'test',
//     host: '127.0.0.1',
//     port: '5432'
// })

const result = request('https://en.wikipedia.org/wiki/Special:Random', async (e, response) => {
    console.log('Inserting new wiki todo: ', result.uri.href)
    await psql.connect()

    let linkWiki = result.uri.href

    const query = {
        text: 'INSERT INTO todos(todo) VALUES($1)',
        values: ['Read ' + linkWiki]
    }
    psql.query(query)

    process.exit()
})
