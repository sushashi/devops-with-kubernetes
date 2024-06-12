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
    console.log(date + ": " + str)
}

const run = () => {
    str = generateString()

    printOut(str)
    setInterval(() => {
        printOut(str)
    }, 5000)
}

run()