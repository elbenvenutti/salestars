'use strict';

const POLLING_INTERVAL = 1;

const rest = require('rest');

const SpriteCollection = require('./SpriteCollection');
const SoundManager = require('./SoundManager');

const soundManager = new SoundManager();
const starCollection = new SpriteCollection();

var context;
const secondaryCanvas = document.createElement('canvas');
const secondaryContext = secondaryCanvas.getContext('2d');

const resizeCanvas = () => {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    secondaryContext.canvas.width = window.innerWidth;
    secondaryContext.canvas.height = window.innerHeight;
};
addEventListener('resize', resizeCanvas, false);

var drawFrame;
const animate = () => window.requestAnimationFrame(drawFrame);
drawFrame = () => {
    context.clearRect(0, 0, secondaryContext.canvas.width, secondaryContext.canvas.height);
    secondaryContext.clearRect(0, 0, secondaryContext.canvas.width, secondaryContext.canvas.height);

    starCollection.drawFrame(secondaryContext);

    context.drawImage(secondaryCanvas, 0, 0);
    animate();
};

const createStarsFromResponse = response => {
    const data = JSON.parse(response.entity);
    const minDate = data.reduce((a, b) => a ? Math.min(a, Date.parse(b.created)) : Date.parse(b.created));
    data.forEach((policyData) => {
        var policy = {
            premium: parseFloat(policyData.premium.replace(/[£,]/g, '')),
            postcode: policyData.postcode,
            numberOfQuotes: policyData.number_of_quotes
        };

        const spriteDelay = Date.parse(policyData.created) - minDate;
        const delay = delayedFunction => setTimeout(delayedFunction, spriteDelay);

        if (policyData.event.indexOf('purchase') > -1) {
            delay(() => starCollection.addPurchase(policy));
        } else if (policyData.event.indexOf('cancel') > -1) {
            delay(() => starCollection.addCancellation(policy));
        } else {
            delay(() => starCollection.addQuote(policy));
        }
    });
};

const updatePolicyData = idToken => () => rest(`./policies?idToken=${idToken}&minutes=${POLLING_INTERVAL}`).then(createStarsFromResponse);

addEventListener('spriteCreated', () => soundManager.playBells());
addEventListener('purchaseSpriteCreated', () => soundManager.playPurchase());
addEventListener('enquirySpriteCreated', () => soundManager.playElf());

window.appStart = googleUser => {
    const idToken = googleUser.getAuthResponse().id_token;

    document.getElementById('signin').style.display = 'none';
    document.getElementById('container').style.display = 'block';
    context = document.getElementById('main').getContext('2d');

    resizeCanvas();
    updatePolicyData(idToken)();
    setTimeout(animate, 0);
    setInterval(updatePolicyData(idToken), POLLING_INTERVAL * 60000);
};
