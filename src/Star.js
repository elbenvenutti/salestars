'use strict';

const SPEED = 30;
const STAR_SIZE = 100;

var loadBubbleImage = (colour) => {
    var bubbleImage = new Image();
    bubbleImage.src = `./${colour}Bubble.png`;
    return bubbleImage;
};

var bubbleImages = [ 'green', 'orange', 'red' ].map((colour) => loadBubbleImage(colour));

class Bubble {
    constructor(_policy, _image) {
        this.policy = _policy;
        this.speed = SPEED / 2000 + Math.random() / SPEED;
        this.image = _image;
        this.created = Date.now();
        this.drawExtraElements = () => {};

        this.notify();
    }

    notify() {
        dispatchEvent(new CustomEvent('bubbleCreated', { detail: { premium: this.policy.premium } }));
    }

    draw(context) {
        var calculateYPosition = () => {
            var y;
            y = Math.round(this.yy - this.speed * (Date.now() - this.created));
            if (y < -STAR_SIZE) {
                dispatchEvent(new CustomEvent('destroyBubble', { detail: { bubble: this } }));
            } else if (y > this.yy) {
                y = this.yy;
            }
            return y;
        };

        this.width = context.canvas.width;
        this.height = context.canvas.height;

        if (!this.x) {
            this.x = STAR_SIZE / 2 + Math.random() * (this.width - 1.5 * STAR_SIZE);
        }
        if (!this.yy) {
            this.yy = STAR_SIZE / 2 + Math.random() * (this.height - 1.5 * STAR_SIZE);
        }

        var y = calculateYPosition();

        var scale = 0.25 + this.policy.premium / 400;
        var radius = 5 * (5 + Math.sin(y / 30));
        const rrr = (STAR_SIZE / 2);

        context.save();
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.scale(scale, scale);
        console.log((Date.now() - this.created) / 1000);
        context.fillStyle = 'rgba(255, 255, 255, ' + Math.max(5, (Date.now() - this.created) / 1000) / 5 + ')';
        context.font = 'bold 20px helvetica';
        context.translate(this.x / scale, y / scale);
        context.fillText(`£${this.policy.premium.toFixed(2)}`, rrr, 40);
        context.font = '14px helvetica';
        context.fillText(`${this.policy.postcode}`, rrr, 60);
        this.drawExtraElements(context);
        context.restore();

        context.save();
        context.scale(scale, scale);
        context.translate(this.x / scale, this.yy / scale);
        context.beginPath();
        context.arc(rrr, rrr, radius, 0, Math.PI * 2, true);
        context.closePath();
        var gradient = context.createRadialGradient(rrr, rrr, 0, rrr, rrr, radius);
        gradient.addColorStop(0.0, 'rgba(255,255,255,1.0)');
        gradient.addColorStop(0.5, 'rgba(152,255,255,0.6)');
        gradient.addColorStop(1.0, 'rgba(192,192,255,0)');
        context.fillStyle = gradient;
        context.fill();
        context.restore();
    }
}

class Red extends Bubble {
    constructor(_policy) {
        super(_policy, bubbleImages[2]);
    }
}

class Amber extends Bubble {
    constructor(_policy) {
        super(_policy, bubbleImages[1]);

        this.drawExtraElements = (context) => {
            context.font = 'bold 16px helvetica';
            context.fillText(this.policy.numberOfQuotes, 50, 75);
        };
    }
}

class Green extends Bubble {
    constructor(_policy) {
        super(_policy, bubbleImages[0]);
    }

    notify() {
        dispatchEvent(new Event('purchaseBubbleCreated'));
    }
}

module.exports = {
    Red: Red,
    Amber: Amber,
    Green: Green
};
