
var mongodb = require('mongodb');
var moment = require('moment');

exports.up = function(db, next){
  var trackingparams = db.collection('trackingparams');
  var users = db.collection('users');
  var created = new Date();
  users.findOne({ 'providerData.id': '1027388303997749' }).then(function(data, err) {
    if(err){
      console.log('error');
    } else {
      trackingparams.insert([
        {
          'user': data._id,
          'created': moment(created, 'YYYY-M-DD HH:mm:ss')._d,
          'description': 'The average cost per click for these ads, calculated as the amount spent divided by the number of clicks received. (float)',
          'value': 'cpc',
          'name': 'Cost Per Click',
          '__v': 0
        },

              /* 2 */
        {
          'user': data._id,
          'created': moment(created, 'YYYY-M-DD HH:mm:ss')._d,
          'description': 'The average cost you\'ve paid to have 1,000 impressions on your ad. (float)',
          'value': 'cpm',
          'name': 'Cost Per Mile',
          '__v': 0
        },

              /* 3 */
        {
          'user': data._id,
          'created': moment(created, 'YYYY-M-DD HH:mm:ss')._d,
          'description': 'The average cost you\'ve paid to have your ad served to 1,000 unique people. (float)',
          'value': 'cpp',
          'name': 'Cost Per 1000 People',
          '__v': 0
        },

              /* 4 */
        {
          'user': data._id,
          'created': moment(created, 'YYYY-M-DD HH:mm:ss')._d,
          'description': 'The number of clicks you received divided by the number of impressions. (float)',
          'value': 'ctr',
          'name': 'Cost to Reach',
          '__v': 0
        },

              /* 5 */
        {
          'user': data._id,
          'created': moment(created, 'YYYY-M-DD HH:mm:ss')._d,
          'description': 'The number of times your ad was served. On our mobile apps an ad is counted as served the first time it\'s viewed. On all other Facebook interfaces, an ad is served the first time it\'s placed in a person\'s News Feed or each time it\'s placed in the right column.(string)',
          'value': 'impressions',
          'name': 'Impressions',
          '__v': 0
        },

              /* 6 */
        {
          'user': data._id,
          'created': moment(created, 'YYYY-M-DD HH:mm:ss')._d,
          'description': 'The average you paid for each type of unique action.',
          'value': 'cost_per_action_type',
          'name': 'Cost Per Action',
          '__v': 0
        }], next);
    }
  });
  next();
};

exports.down = function(db, next){
  next();
};
