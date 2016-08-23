
var mongodb = require('mongodb');

exports.up = function(db, next){
  var users = db.collection('users');
  users.updateOne({ 'providerData.id': '1027388303997749' }, {
    '$set': {
      'roles' : [
        'admin'
      ]
    }
  });
  next();
};

exports.down = function(db, next){
  next();
};
