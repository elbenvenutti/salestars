'use strict';

var Sprite = require('./Sprite');

module.exports = class {
    constructor () {
        this.sprites = [];
        addEventListener('destroySprite', event => this.sprites.splice(this.sprites.indexOf(event.detail.sprite), 1));
    }

    addPurchase(policy) {
        this.sprites.push(new Sprite.Purchase(policy));
    }

    addQuote(policy) {
        this.sprites.push(new Sprite.Quote(policy));
    }

    addCancellation(policy) {
        this.sprites.push(new Sprite.Cancellation(policy));
    }

    drawFrame(context) {
        this.sprites.forEach(sprite => sprite.draw(context));
    }
};
