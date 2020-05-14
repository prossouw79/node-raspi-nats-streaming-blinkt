
require('dotenv').config()
const os = require('os')

const STAN = require('node-nats-streaming')
const _ = require('lodash')

const clusterID = 'test-cluster'
const clientID = `node-pub-${os.userInfo().username}-${os.hostname()}`
const server = `nats://${process.env.NATS_HOST}:4222`
const LED = require('./classes/LED.js')

let ledColorsDefined = [
    new LED("red", 255, 0, 0),
    new LED("green", 0, 255, 0),
    new LED("blue", 0, 0, 255),
    new LED("yellow", 255, 255, 0),
    new LED("magenta", 255, 0, 255),
    new LED("cyan", 0, 255, 255),
    new LED("white", 255, 255, 255)
]

let hostsDefined = [
    'pi1',
    'pi2',
    'pi3'
]


const sc = STAN.connect(clusterID, clientID, server)
sc.on('connect', () => {
    setInterval(() => {
        const subject = `led-colour-update-${_.sample(hostsDefined)}`
        const selectedColor = _.sample(ledColorsDefined)

        sc.publish(subject, JSON.stringify(selectedColor), (err, guid) => {
            if (err) {
                console.log(err)
                process.exit(1)
            } else {
                console.log(`Published to '${subject}' (${guid})`)
            }
            // sc.close()
        })
    }, 5);
})

sc.on('error', function (reason) {
    console.log(reason)
})
