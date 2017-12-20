var faker = require('faker');
var _ = require('lodash');
var moment = require('moment');

module.exports = {
    path: '/policies',
    collection: true,
    cache: false,
    size: function() {
        return _.random(10, 60);
    },
    template: function (params, query) {
        console.log(params, query);
        return {
            premium: () => faker.finance.amount(100, 500, 2, '£ '),
            postcode: () => faker.random.arrayElement(['EC3A 7LP', 'SW1A 1AA', 'N5 1BU', 'SW6 1HS', 'EC3N 4AB']),
            number_of_quotes: () => 1 + faker.random.number(10),
            event: () => {
                const r = faker.random.number(100);
                return r > 80 ? 'new business policy' :
                    r > 60 ? 'cancelled policy' :
                    r > 50 ? 'renewal policy' : 'new business'
            },
            created: () => moment().subtract(faker.random.number((query.minutes || 1) * 60), 'seconds')
        };
    }
};
