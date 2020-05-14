const Blinkt = require('node-blinkt')
const leds = new Blinkt();

leds.setup();
leds.clearAll();
leds.sendUpdate();