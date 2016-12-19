'use strict';

const STAR_RADIUS = 7;
const TWINKLE_RATE = 1300;
const TEXT_SPEED = 50;
const TEXT_TTL = 10000;
const STAR_TTL = 120000;
const SKYLINE_HEIGHT = 100;
const TEXT_DIRECTION_UP = -1;
const TEXT_DIRECTION_DOWN = 1;

class Sprite {
    constructor(_policy) {
        this.policy = _policy;
        this.created = Date.now();
        this.drawExtraElements = () => {};
        this.textDirection = TEXT_DIRECTION_UP;

        this.notify();
    }

    notify() {
        dispatchEvent(new CustomEvent('spriteCreated', { detail: { premium: this.policy.premium } }));
    }

    cleanup() {
        dispatchEvent(new CustomEvent('destroySprite', { detail: { sprite: this } }));
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
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillStyle = `rgba(255, 255, 255, ${0.5 * (1 - life / TEXT_TTL)})`;
                context.font = 'bold 20px helvetica';
                context.translate(0, this.textDirection * textY);
                context.fillText(`£${this.policy.premium.toFixed(2)}`, STAR_RADIUS, -10);
                context.font = '14px helvetica';
                context.fillText(`${this.policy.postcode}`, STAR_RADIUS, 10);
                this.drawExtraElements(context);
                context.restore();
            }
        };

        const drawStar = () => {
            context.save();
            context.translate(this.x, this.y);
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
        }
    }
}

class Cancellation extends Sprite {
    constructor(_policy) {
        super(_policy);

        this.textDirection = TEXT_DIRECTION_DOWN;
    }
}

class Quote extends Sprite {
    constructor(_policy) {
        super(_policy);

        this.drawExtraElements = (context) => {
            context.font = 'bold 16px helvetica';
            context.fillText(this.policy.numberOfQuotes, STAR_RADIUS, 30);
        };
    }
}

var loadSantaImage = () => {
    var image = new Image();
    image.src = `./santa.png`;
    return image;
};

var santaImage = loadSantaImage();

const SANTA_WIDTH = 204;
const SANTA_HEIGHT = 82;
const SANTA_TTL = 20000;

class Purchase extends Sprite {
    constructor(_policy) {
        super(_policy);
    }

    notify() {
        dispatchEvent(new Event('purchaseSpriteCreated'));
    }

    draw(context) {
        this.delta = this.delta || 200 * Math.random();
        const {width, height} = context.canvas;
        const alpha = Math.atan((4 * height + this.delta) / width);
        const life = Date.now() - this.created;

        if (life <= SANTA_TTL) {
            context.save();

            context.globalAlpha = 0.5;
            context.translate(width / 2, height * 2);
            context.rotate(2 * alpha * life / SANTA_TTL - alpha);
            context.translate(-width / 2, -height * 2);
            context.drawImage(santaImage, (width - SANTA_WIDTH) / 2, this.delta, SANTA_WIDTH, SANTA_HEIGHT);

            context.textAlign = 'center';
            context.fillStyle = `rgba(255, 255, 255, 1)`;
            context.font = 'bold 20px helvetica';
            context.fillText(`£${this.policy.premium.toFixed(2)}`, 10 + width / 2, 10 + SANTA_HEIGHT + this.delta);
            context.font = '12px helvetica';
            context.fillText(`${this.policy.postcode}`, 10 + width / 2, 20 + SANTA_HEIGHT + this.delta);

            context.restore();
        } else {
            this.cleanup();
        }
    }
}

module.exports = {
    Cancellation,
    Quote,
    Purchase
};