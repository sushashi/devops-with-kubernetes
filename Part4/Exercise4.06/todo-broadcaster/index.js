const NATS = require('nats');
const { WebhookClient } = require('discord.js');
const { pid } = require('node:process');

const webhookClient = new WebhookClient({ url: process.env.DISCORD_URL});

const NATS_SERVER = process.env.NATS_URL || "127.0.0.1:4222"

const start = async () => {
    // to create a connection to a nats-server:
    const nc = await NATS.connect({ servers: NATS_SERVER });

    // create a codec
    const sc = NATS.StringCodec();

    // create a simple subscriber and iterate over messages
    // matching the subscription using QUEUE SUBSCRIPTIONS
    const sub_created = nc.subscribe("todos" , {queue: "workers"});

    (async () => {
      for await (const m of sub_created) {
        console.log(`[${sub_created.getProcessed()}]: ${sc.decode(m.data)}`);

        const msg = sc.decode(m.data) // msg is JSON.stringified
        const todo_done = JSON.parse(msg).done ? 'done' : 'created';

        console.log('Todo ', todo_done)
        console.log(JSON.parse(msg))
        const test_msg = JSON.stringify(JSON.parse(msg), null, 2)
        
        // console.log('Process ID: ', pid)
        webhookClient.send({
          content: 'Todo ' + todo_done + ': \n' + "```json\n" + test_msg + "\n```",
          username: 'DwK tester'
        })
      }
      console.log("subscription closed");
    })();
}

start()