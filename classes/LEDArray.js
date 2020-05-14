const LED = require('./LED');
const fakeBlinkt = require('./fakeBlinkt')

class LEDArray {
    constructor(hostname, blinkt) {
        this.hostname = hostname;
        this.blinkt = blinkt ? blinkt : fakeBlinkt;
        this.leds = [];
        for (let i = 0; i < 8; i++) {
            this.leds.push(new LED())
        }
    }

    addFront(addedLED) {
        let tmp = [addedLED];

        for (let i = 0; i < (this.leds.length - 1); i++) {
            let led = this.leds[i];
            led.index = led.index + 1;
            tmp.push(led);
        }

        this.leds = tmp;
        this.applyUpdate()
    }

    applyUpdate() {
        let index = 0;
        this.leds.forEach(led => {

            this.blinkt.setPixel(
                index++,
                led.red,
                led.green,
                led.blue,
                led.brightness
            )
        });
        this.blinkt.sendUpdate()
    }
}

module.exports = LEDArray;