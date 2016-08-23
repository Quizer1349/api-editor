
var mongodb = require('mongodb');
var moment = require('moment');

exports.up = function(db, next){
  var settings = db.collection('appsettings');
  var users = db.collection('users');
  var created = new Date();
  users.findOne({ 'providerData.id': '1027388303997749' }).then(function(data, err){
    if(err){
      console.log('error setings');
    } else {
      console.log(data._id);
      settings.insert([{
        'user': data._id,
        'created': moment(created, 'YYYY-M-DD HH:mm:ss')._d,
        'value': 'Hi %name%! You can create new alerts using http://sha.red/2bkz3GH. Once that\'s done, I\'ll keep an eye on your Ad Campaigns and send you a notification anytime one of your alerts gets triggered.',
        'name': '1 registerMessageForExistingUser',
        '__v': 0
      },
      {
        'user': data._id,
        'created': moment(created, 'YYYY-M-DD HH:mm:ss')._d,
        'value': 'Hi. I\'m an AutoBot. To register for Ad alerts, type ID:<your facebook id> You can find your Facebook ID by signing into the web app and going to your profile page http://sha.red/2bkzOzD.',
        'name': '2 registerMessageForNewUser',
        '__v': 0
      }], next);
    }
  });
    // console.log(userId);

  next();
};

exports.down = function(db, next){
  next();
};
