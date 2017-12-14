'use strict';

const Howl = require('howler').Howl;
const _ = require('lodash/fp');

const ELF_SOUNDS = 37;

module.exports = class {
    constructor() {
        this.purchaseSound = new Howl({ urls: [ 'sounds/santa/HoHoHo.mp3' ] });
        this.bellSound = new Howl({ urls: [ 'sounds/santa/bells.mp3' ] });
        this.elfSounds = _.range(0, ELF_SOUNDS).map(index =>
            new Howl({urls: [`ElfVoices/elf${index + 1}.mp3`]})
        )
    }

    playPurchase() {
        this.purchaseSound.play();
    }

    playBells() {
        this.bellSound.play();
    }

    playElf() {
        this.elfSounds[Math.floor(Math.random() * ELF_SOUNDS)].play();
    }
};
