'use strict';

var Howl = require('howler').Howl;

module.exports = class {
    constructor() {
        this.purchaseSound = new Howl({ urls: [ 'santa/HoHoHo.mp3' ] });
        this.bellSound = new Howl({ urls: [ 'santa/bells.mp3' ] });
    }

    playPurchase() {
        this.purchaseSound.play();
    }

    playBells() {
        this.bellSound.play();
    }
};
