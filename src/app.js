'use strict';

const POLLING_INTERVAL = 1;

var rest = require('rest');

var StarCollection = require('./StarCollection');
var SoundManager = require('./SoundManager');

var soundManager = new SoundManager();
var starCollection = new BubbleCollection();

var context;
var resizeCanvas = () => {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
};
addEventListener('resize', resizeCanvas, false);

var drawFrame;
var animate = () => window.requestAnimationFrame(drawFrame);
drawFrame = () => {
    context.globalCompositeOperation = 'destination-over';
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    starCollection.drawFrame(context);

    animate();
};

var createStarsFromResponse = (response) => {
    var data = JSON.parse(response.entity);
    var minDate = data.reduce((a, b) => a ? Math.min(a, Date.parse(b.created)) : Date.parse(b.created));
    data.forEach((policyData) => {
        var policy = {
            premium: parseFloat(policyData.premium.replace(/[£,]/g, '')),
            postcode: policyData.postcode,
            numberOfQuotes: policyData.number_of_quotes
        };

        var bubbleDelay = Date.parse(policyData.created) - minDate;
        var delay = delayedFunction => setTimeout(delayedFunction, bubbleDelay);

        if (policyData.event.indexOf('purchase') > -1) {
            delay(() => starCollection.addPurchase(policy));
        } else if (policyData.event.indexOf('cancel') > -1) {
            delay(() => starCollection.addCancellation(policy));
        } else {
            delay(() => starCollection.addEnquiry(policy));
        }
    });
};

var updatePolicyData = () => rest(`./policies?minutes=${POLLING_INTERVAL}`).then(createStarsFromResponse);

addEventListener('starCreated', () => soundManager.playBells());
addEventListener('purchaseStarCreated', () => soundManager.playPurchase());

addEventListener('bubbleCreated', () => soundManager.playBells());
addEventListener('purchaseBubbleCreated', () => soundManager.playPurchase());

window.onload = () => {
    context = document.getElementById('main').getContext('2d');
    resizeCanvas();
    updatePolicyData();
    setTimeout(animate, 0);
    setInterval(updatePolicyData, POLLING_INTERVAL * 60000);
};
