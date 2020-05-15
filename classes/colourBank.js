const LED = require('./LED')
let colourIntensity = 150;
let ledColorsDefined = [
    new LED("red", colourIntensity, 0, 0),
    new LED("green", 0, colourIntensity, 0),
    new LED("blue", 0, 0, colourIntensity),
    new LED("yellow", colourIntensity, colourIntensity, 0),
    new LED("magenta", colourIntensity, 0, colourIntensity),
    new LED("cyan", 0, colourIntensity, colourIntensity),
    new LED("white", colourIntensity, colourIntensity, colourIntensity)
]

module.exports = ledColorsDefined