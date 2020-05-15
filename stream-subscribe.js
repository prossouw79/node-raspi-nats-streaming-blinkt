require('dotenv').config()
const os = require('os')

const ledArray = require('./classes/LEDArray')
const demoOptions = require('./classes/demoOptions')


//Setup NATS Streaming
const STAN = require('node-nats-streaming')
const clusterID = 'test-cluster'
const clientID = `led-colour-update-${os.hostname()}`
const server = `nats://${process.env.NATS_USER}:${process.env.NATS_PWD}@${process.env.NATS_HOST}:4222`
const queueGroup = 'node-sub-pieter'
const subject = `led-colour-update-${os.hostname()}`
const stan = STAN.connect(clusterID, clientID, server, {
    maxReconnectAttempts: -1
});


//Setup blinkt lib
if (os.arch() == 'arm') {
    var Blinkt = require('node-blinkt')
    var blinkt_leds = new Blinkt();
    blinkt_leds.setup();
    blinkt_leds.clearAll();
    blinkt_available = true;
    var LEDArray = new ledArray(os.hostname(), blinkt_leds)
} else {
    console.warn('Not running on a Raspberry Pi. The chalk library will be used as a fallback.')

    //Initialize LED array with no Blinkt library: using 'chalk' console lib
    var LEDArray = new ledArray(os.hostname(), null)
}

stan.on('connect', async function () {
    console.log('STAN connected!')

    let opts = stan.subscriptionOptions();

    //Rate limiting on the subscriber side 
    opts.setManualAckMode(true)
    opts.setAckWait(3000)
    opts.setMaxInFlight(1)

    demoOptions.setSubscriptionOptions(+process.env.DEMONSTRATION_MODE, opts)

    await sleep(+process.env.DEMO_WAIT)

    const subscription = stan.subscribe(subject, queueGroup, opts)
    subscription.on('error', (err) => {
        console.log(`subscription for ${subject} raised an error: ${err}`)
    })
    subscription.on('unsubscribed', () => {
        console.log(`unsubscribed to ${subject}`)
    })
    subscription.on('ready', (sub) => {
        console.log(`subscribed to ${subscription.subject}`)
    })
    // Handle message
    subscription.on('message', async function (msg) {
        // console.log(`SUB:'${msg.getSubject()}' | SEQ # ${msg.getSequence()}`)
        let led = JSON.parse(msg.getData())

        LEDArray.addFront(led)
        await sleep(+process.env.SUB_RATELIMIT_DELAY)
        msg.ack();
    });

    stan.on('disconnect', function () {
        console.info('STAN disconnected!')
    })
})

stan.on('error', function (reason) {
    console.log(reason)
})

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}   