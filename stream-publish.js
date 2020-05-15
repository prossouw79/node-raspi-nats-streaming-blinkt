
require('dotenv').config()
const os = require('os')

const STAN = require('node-nats-streaming')
const _ = require('lodash')

const clusterID = 'test-cluster'
const clientID = `node-pub-${os.userInfo().username}-${os.hostname()}`
const server = `nats://${process.env.NATS_USER}:${process.env.NATS_PWD}@${process.env.NATS_HOST}:4222`
const LED = require('./classes/LED.js')
const ledColorsDefined = require('./classes/colourBank')

let colourNames = ledColorsDefined.map(l => l.name).concat('random')

let hostsDefined = [
    'pi1',
    'pi2',
    'pi3',
    `${os.hostname()}`
]

let args = process.argv.slice(2);

if (!args) {
    console.log(`Error! \n\nPlease specify two arguments: <host> and <colour>.\nAvailable colours: ${colourNames.join(', ')}\nAvailable hosts: ${hostsDefined.join(', ')}`)
    process.exit(1)
}

//get specified host
let selectedHost = _.find(hostsDefined, h => {
    return h === args[0]
})
if(!selectedHost){
    console.log(`Could not match '${args[0]}' in ${hostsDefined.join(', ')}`)
    process.exit(1)
}

//get specified color
if(args[1] == "random"){
    args[1] = _.sample(ledColorsDefined).name
    console.log(`Randomly selected colour: ${args[1]}`)
}
let selectedColor = _.find(ledColorsDefined, led => {
    return led.name === args[1]
})
if(!selectedColor){
    console.log(`Could not match '${args[1]}' in ${colourNames.join(', ')}`)
    process.exit(1)
}

const subject = `led-colour-update-${os.userInfo().username}-${selectedHost}`

const sc = STAN.connect(clusterID, clientID, server)
sc.on('connect', () => {
    console.log('connected!')
    sc.publish(subject, JSON.stringify(selectedColor), (err, guid) => {
        if (err) {
            console.log(err)
            process.exit(1)
        } else {
            console.log(`Published to '${subject}' (${guid})`)
        }
        sc.close()
    })
})

sc.on('error', function (reason) {
    console.log(reason)
})