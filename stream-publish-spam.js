
require('dotenv').config()
const os = require('os')

const STAN = require('node-nats-streaming')
const _ = require('lodash')

const clusterID = 'test-cluster'
const clientID = `node-pub-${os.userInfo().username}-${os.hostname()}`
const server = `nats://${process.env.NATS_USER}:${process.env.NATS_PWD}@${process.env.NATS_HOST}:4222`
const LED = require('./classes/LED.js')
const ledColorsDefined = require('./classes/colourBank')

let hostsDefined = [
    // 'pi1',
    // 'pi2',
    // 'pi3',
    `${os.hostname()}`
]


const sc = STAN.connect(clusterID, clientID, server)
sc.on('connect', () => {
    setInterval(() => {
        const subject = `led-colour-update-${os.userInfo().username}-${_.sample(hostsDefined)}`
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
    }, +process.env.SUB_RATELIMIT_DELAY);
})

sc.on('error', function (reason) {
    console.log(reason)
})
