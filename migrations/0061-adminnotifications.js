
var mongodb = require('mongodb');
var moment = require('moment');

exports.up = function(db, next){
  var collection = db.collection('adminnotifications');
  var users = db.collection('users');
  var created = new Date();
  users.findOne({ 'providerData.id': '1027388303997749' }).then(function(data, err) {
    if (err) {
      console.log('error');
    } else {
      collection.insert([
        {
          'user': data._id,
          'text': 'Test Text Message',
          'status': 'Send',
          'created': moment(created, 'YYYY-M-DD HH:mm:ss')._d
        },
        {
          'user': data._id,
          'text': 'Test Text Message one more',
          'status': 'Not Sended',
          'created': moment(created, 'YYYY-M-DD HH:mm:ss')._d
        }
      ], next);
      next();
    }
  });
};

exports.down = function(db, next){
  next();
};
