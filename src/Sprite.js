'use strict';

const _ = require('lodash/fp');

const STAR_RADIUS = 7;
const TWINKLE_RATE = 1300;
const TEXT_SPEED = 50;
const TEXT_TTL = 10000;
const STAR_TTL = 120000;
const SKYLINE_HEIGHT = 100;
const TEXT_DIRECTION_UP = -1;
const TEXT_DIRECTION_DOWN = 1;

const ELF_COUNT = 26;
const ELF_WIDTH = 45;
const ELF_HEIGHT = 105.5;
const ELF_TTL = 2500;

const elfs = _.range(0, ELF_COUNT).map(index => {
    const image = new Image();
    image.src = `./ElfPNGs/elf${index + 1}.png`;
    return image;
});

const GRINCH_WIDTH = 161 / 2;
const GRINCH_HEIGHT = 279 / 2;
const GRINCH_TTL = 6000;

const grinchImage = (() => {
    var image = new Image();
    image.src = `./images/Grinch.png`;
    return image;
})();

const altGrinchImage = (() => {
    var image = new Image();
    image.src = `./images/paulGrinch.png`;
    return image;
})();

class Sprite {
    constructor(_policy) {
        this.policy = _policy;
        this.created = Date.now();
        this.textDirection = TEXT_DIRECTION_UP;

        this.notify();
    }

    notify() {
        dispatchEvent(new CustomEvent('spriteCreated', { detail: { premium: this.policy.premium } }));
    }

    cleanup() {
        dispatchEvent(new CustomEvent('destroySprite', { detail: { sprite: this } }));
    }

    drawElf() {}

    drawGrinch() {}

    details(context, textY) {
        context.font = 'bold 20px helvetica';
        context.translate(0, this.textDirection * textY);
        context.fillText(`£${this.policy.premium.toFixed(2)}`, STAR_RADIUS, -10);
        context.font = '14px helvetica';
        context.fillText(`${this.policy.postcode}`, STAR_RADIUS, 10);
    }

    draw(context) {
        const width = context.canvas.width;
        const height = context.canvas.height;

        const getPosition = () => {
            this.x = this.x || Math.round(25 + (width - 50) * Math.random());
            this.y = this.y || Math.round((height - SKYLINE_HEIGHT) * Math.random());
        };

        const life = Date.now() - this.created;

        const drawText = () => {
            if (life < TEXT_TTL) {
                const textY = life / TEXT_SPEED;
                context.save();
                this.drawGrinch(context, life);
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillStyle = `rgba(255, 255, 255, ${0.5 * (1 - life / TEXT_TTL)})`;
                this.details(context, textY);
                context.restore();
            }
        };

        const drawStar = () => {
            context.save();
            context.translate(this.x, this.y);
            this.drawElf(context, life);
            context.beginPath();
            context.arc(STAR_RADIUS, STAR_RADIUS, STAR_RADIUS, 0, Math.PI * 2, true);
            context.closePath();
            var gradientRadius = STAR_RADIUS * (1 + Math.sin((Date.now() - this.created) / TWINKLE_RATE)) / 2;
            var gradient = context.createRadialGradient(STAR_RADIUS, STAR_RADIUS, 0, STAR_RADIUS, STAR_RADIUS, gradientRadius);
            gradient.addColorStop(0.0, 'rgba(255,255,255,1.0)');
            gradient.addColorStop(0.5, 'rgba(152,255,255,0.6)');
            gradient.addColorStop(1.0, 'rgba(192,192,255,0)');
            context.fillStyle = gradient;
            context.fill();
            drawText();
            context.restore();
        };

        if (life <= STAR_TTL) {
            getPosition();
            drawStar();
        } else {
            this.cleanup();
        };
    }
}

class Cancellation extends Sprite {
    constructor(_policy) {
        super(_policy);

        this.textDirection = TEXT_DIRECTION_DOWN;
    }

    notify() {
        dispatchEvent(new Event('cancellationSpriteCreated'));
    }

    getGrinch() {
        return grinchImage;
    }

    drawGrinch(context, life) {
        if (life < GRINCH_TTL) {
            context.save();
            context.globalAlpha = Math.sin(0.9 * Math.PI * life / GRINCH_TTL);
            context.drawImage(this.getGrinch(), -GRINCH_WIDTH / 1.5, 0, GRINCH_WIDTH, GRINCH_HEIGHT);
            context.restore();
        }
    }

    details(context, textY) {
        context.font = 'bold 20px helvetica';
        context.translate(0, this.textDirection * textY);
        context.fillText(`${this.policy.postcode}`, STAR_RADIUS, 10);
    }
}

class AltCancellation extends Cancellation {
    getGrinch() {
        return altGrinchImage;
    }
}

class Quote extends Sprite {
    constructor(_policy) {
        super(_policy);

        this.elf = elfs[Math.floor(Math.random() * ELF_COUNT)];
    }

    notify() {
        super.notify();
        dispatchEvent(new Event('enquirySpriteCreated'));
    }

    drawElf(context, life) {
        if (life < ELF_TTL) {
            context.save();
            context.globalAlpha = Math.sin(0.9 * Math.PI * life / ELF_TTL);
            context.drawImage(this.elf, -ELF_WIDTH / 1.5, 0, ELF_WIDTH, ELF_HEIGHT);
            context.restore();
        }
    };
}

const loadSantaImage = () => {
    var image = new Image();
    image.src = `./images/santadam.png`;
    return image;
};

const santaImage = loadSantaImage();

const altSantaImage = (() => {
    var image = new Image();
    image.src = `./images/santoni.png`;
    return image;
})();

const SANTA_WIDTH = 204;
const SANTA_HEIGHT = 82;
const SANTA_SPEED = 0.8;
const SANTA_TTL = 10000;

class Purchase extends Sprite {
    constructor(_policy) {
        super(_policy);
    }

    notify() {
        dispatchEvent(new Event('purchaseSpriteCreated'));
    }

    getSanta() {
        return santaImage;
    }

    draw(context) {
        const {width, height} = context.canvas;
        this.delta = this.delta || height / 3 * Math.random();
        this.gamma = this.gamma || 3 * width / 4 * Math.random();
        this.rotationCenterX = this.rotationCenterX || width / 4 + this.gamma;
        this.rotationCenterY = this.rotationCenterY || height * 2 + this.delta;
        const alpha = - Math.atan(this.rotationCenterX / this.rotationCenterY);
        const beta = Math.atan((width - this.rotationCenterX) / this.rotationCenterY) + Math.PI / 6;
        const life = Date.now() - this.created;

        if (life <= SANTA_TTL) {
            context.save();

            context.globalAlpha = 0.8;
            context.translate(this.rotationCenterX, this.rotationCenterY);
            context.rotate(SANTA_SPEED * (beta - alpha) * life / SANTA_TTL + alpha);
            context.translate(-this.rotationCenterX, -this.rotationCenterY);
            context.drawImage(this.getSanta(), (width - SANTA_WIDTH) / 2, this.delta, SANTA_WIDTH, SANTA_HEIGHT);

            context.textAlign = 'center';
            context.fillStyle = `rgba(255, 255, 255, 1)`;
            context.font = 'bold 20px helvetica';
            // context.fillText(`£${this.policy.premium.toFixed(2)}`, 10 + width / 2, 10 + SANTA_HEIGHT + this.delta);
            // context.font = '12px helvetica';
            context.fillText(`${this.policy.postcode}`, 10 + width / 2, 20 + SANTA_HEIGHT + this.delta);

            context.restore();
        } else {
            this.cleanup();
        }
    }
}

class AltPurchase extends Purchase {
    getSanta() {
        return altSantaImage;
    }
}

module.exports = {
    Cancellation,
    AltCancellation,
    Quote,
    Purchase,
    AltPurchase
};
