var faker = require('faker');
var _ = require('lodash');
var moment = require('moment');

module.exports = {
    path: '/policies',
    collection: true,
    cache: false,
    size: function() {
        return _.random(10, 60)
    },
    template: function (params, query) {
        console.log(params, query);
        return {
            premium: () => faker.finance.amount(100, 900, 2, '£ '),
            postcode: 'EC3A 7LP',
            number_of_quotes: () => faker.random.number(12),
            event: () => ([
                faker.random.number(100) > 70 ? 'purchase' : 'other',
                faker.random.number(100) > 80 ? 'cancel' : 'other',
            ]),
            created: () => moment().subtract(faker.random.number((query.minutes || 1) * 60), 'seconds')
        };
    }

};
