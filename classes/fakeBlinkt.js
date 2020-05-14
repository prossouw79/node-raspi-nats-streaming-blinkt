const chalk = require('chalk');

let LEDS = [];

function setPixel(index, r, g, b, brightness) {
    LEDS[index] = {
        r: r,
        g: g,
        b: b,
        brightness: brightness
    }
}

function sendUpdate() {
    console.clear()
    for (let i = 0; i < LEDS.length; i++) {
        console.log(`FakeBlinkt - LED#${i}: ${chalk.rgb(LEDS[i].r, LEDS[i].g, LEDS[i].b).bold("#")}`)
    }
}

module.exports = {
    setPixel: setPixel,
    sendUpdate: sendUpdate
}
