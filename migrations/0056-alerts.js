
var mongodb = require('mongodb');
var moment = require('moment');

exports.up = function(db, next){
  var alerts = db.collection('alerts');
  var users = db.collection('users');
  var created = new Date();
  users.findOne({ 'providerData.id': '1027388303997749' }).then(function(data, err) {
    if (err) {
      console.log('error');
    } else {
      alerts.insert([{
        'user': data._id,
        'shortHash': 'ydUAM',
        'smsEnabled': false,
        'messengerEnabled': true,
        'emailEnabled': true,
        'status': '0',
        'updated': moment(created, 'YYYY-M-DD HH:mm:ss')._d,
        'created': moment(created, 'YYYY-M-DD HH:mm:ss')._d,
        'period': '5',
        'rule': '<=',
        'value': '2',
        'paramLabel': 'Cost Per Click',
        'param': 'cpc',
        'adaccount_id': 'act_616576205078963',
        'typeId': '6046352188460',
        'type': 'adsets',
        'name': 'cpc_loe_2',
        '__v': 0,
        'cron_updated': moment(created, 'YYYY-M-DD HH:mm:ss')._d
      },
      {
        'user': data._id,
        'shortHash': 'C3FrR',
        'smsEnabled': false,
        'messengerEnabled': true,
        'emailEnabled': true,
        'status': '1',
        'updated': moment(created, 'YYYY-M-DD HH:mm:ss')._d,
        'created': moment(created, 'YYYY-M-DD HH:mm:ss')._d,
        'period': '5',
        'rule': '>',
        'value': '1',
        'paramLabel': 'Cost to Reach',
        'param': 'ctr',
        'adaccount_id': 'act_616576205078963',
        'typeId': '6046352188460',
        'type': 'adsets',
        'name': 'ctr_gt_1',
        '__v': 0,
        'cron_updated': moment(created, 'YYYY-M-DD HH:mm:ss')._d
      }], next);
      next();
    }
  });
};

exports.down = function(db, next){
  next();
};
