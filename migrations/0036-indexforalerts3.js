
var mongodb = require('mongodb');

exports.up = function(db, next){
  var collection = db.collection('alerts');
  collection.createIndex({ 'name': 1 },{ unique:false }, next) ;
  next();
};

exports.down = function(db, next){
  next();
};
