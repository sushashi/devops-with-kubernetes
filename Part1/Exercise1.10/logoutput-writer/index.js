const fs = require('fs')

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
    string_toWrite = date + ": " + str

    dir = './files'
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir)
    }

    fs.writeFile(dir + "/text.txt", string_toWrite, err => {
        if (err) {
            console.log("Error writing data")
        } else {
            console.log("Successfully written")
        }
    } )
}

string_mem = generateString()

const run = () => {
    str = string_mem

    printOut(str)
    setInterval(() => {
        printOut(str)
    }, 5000)
}

run()