'use strict';

var Howl = require('howler').Howl;

module.exports = class {
    constructor() {
        this.purchaseSound = new Howl({ urls: [ 'sounds/santa/HoHoHo.mp3' ] });
        this.bellSound = new Howl({ urls: [ 'sounds/santa/bells.mp3' ] });
    }

    playPurchase() {
        this.purchaseSound.play();
    }

    playBells() {
        this.bellSound.play();
    }
};
