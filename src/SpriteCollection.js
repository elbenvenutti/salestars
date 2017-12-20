'use strict';

var Sprite = require('./Sprite');

module.exports = class {
    constructor () {
        this.sprites = [];
        addEventListener('destroySprite', event => this.sprites.splice(this.sprites.indexOf(event.detail.sprite), 1));
        this.useAltGrinch = false;
    }

    addPurchase(policy) {
        this.sprites.push(new Sprite.Purchase(policy));
    }

    addAltPurchase(policy) {
        this.sprites.push(new Sprite.AltPurchase(policy));
    }

    addQuote(policy) {
        this.sprites.push(new Sprite.Quote(policy));
    }

    addCancellation(policy) {
        const CancellationClass = Sprite[this.useAltGrinch ? 'AltCancellation' : 'Cancellation'];
        this.useAltGrinch = !this.useAltGrinch;

        this.sprites.push(new CancellationClass(policy));
    }

    drawFrame(context) {
        this.sprites.forEach(sprite => sprite.draw(context));
    }
};
