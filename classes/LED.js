class LED{
    constructor(colorName, r = 0, g = 0, b = 0, brightness = 0.04){
        this.name = colorName;
        this.red = r;
        this.green = g;
        this.blue = b;
        this.brightness = brightness;
    }
}

module.exports = LED;