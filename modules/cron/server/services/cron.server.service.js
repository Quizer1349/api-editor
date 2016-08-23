/**
 * Created by eugen on 13/07/16.
 */
'use strict';
var REQUEST_PERIOD = 300000;

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  lodash = require('lodash');

/**
 * Alerts module init function.
 */
var mongoose = require('mongoose'),
  Alert = mongoose.model('Alert'),
  User = mongoose.model('User'),
  Adset = mongoose.model('Adset'),
  LogsClass = require(path.resolve('./modules/logs')),
  Logs = new LogsClass(),
  TrackingParam = mongoose.model('Trackingparam'),
  EventModel = mongoose.model('Notificationevent'),
  Message = mongoose.model('Message'),
  fbRequesterClass = require(path.resolve('./modules/fbrequester/index')),
  fbRequester = new fbRequesterClass();

var moment = require('moment');

/**
 * Alerts module init function.
 */


var cron = function () {

};

/***
 * Logs error
 * @param err - error object
 */
var handleError = function (err) {
  Logs.error(Logs.CRON_SERVICE, 'Error', err);
};

/***
 * Creates document in events model
 * @param alert - object contains alert data
 * @param fbValue - value returned by facebook
 * @param alerts - object contains grouped by user alert data
 * @param checkRuleAndSendNotification
 */
var createEvent = function (alert) {
  EventModel.create(alert, function (err, doc) {
    if (err) {
      return handleError(err);
    }
  });

};


/***
 * Prepares data for sending email and notification to messenger
 * @param alertIds
 * @param adsetsIds
 * @param user - user data
 * @param messages - dictionary of messages for different notification methods
 * @param eventIds - ids of events
 */
function prepareDataAndSend(alertIds, adsetsIds, user, messages, eventIds) {
  if (user.emailAlert && user.email && messages.email) {
    var emailStatus = 'Not sent';
    var mailOptions = {
      from: '"Media Buyer" <info.mediabuyer@gmail.com>', // sender address
      to: user.email, // list of receivers
      subject: 'The goal is reached ✔', // Subject line
      text: messages.email // plaintext body
    };
    sendEmail(mailOptions, function (status) {
      if (status) {
        emailStatus = 'Sent';
      } else {
        emailStatus = 'Not sent';
      }
      var nObj = {};
      nObj.alert = alertIds;
      nObj.adset = adsetsIds;
      nObj.user = user._id;

      nObj.event = eventIds;
      nObj.type = 'email';
      nObj.message =  messages.email;
      nObj.status = emailStatus;
      createNotification(nObj);
    });
  }
  if (user.messengerId && user.messengerAlert && messages.messenger) {
    var messStatus = 'Not sent';
    var messageData = {
      recipient: {
        id: user.messengerId
      },
      message: {
        text: messages.messenger
                //   metadata: 'DEVELOPER_DEFINED_METADATA'
      }
    };

    sendMessNotification(messageData, function (status) {
      if (status) {
        messStatus = 'Sent';
      } else {
        messStatus = 'Not sent';
      }
      var nObj = {};
      nObj.alert = alertIds;
      nObj.adset = adsetsIds;
      nObj.user = user._id;

      nObj.event = eventIds;
      nObj.type = 'messenger';
      nObj.message = messages.messenger;
      nObj.status = messStatus;
      createNotification(nObj);
    });
  }
}


/***
 * Checks time when user was notified last time, if need to notify prepare message with values for every 15 minutes
 * @param alerts - alerts data
 * @param user - user data
 * @param eventIds - ids of events
 */
function sendNotification(alerts, user, eventIds) {
  var orConditions = [];
  alerts.performedAlerts.forEach(function (alert) {
    var sinceDate = moment().subtract(parseFloat(alert.period) + 1, 'minutes').toDate();
    var currentDate = moment().toDate();
    orConditions.push({ alert:mongoose.Types.ObjectId(alert.alert), created: { '$lte': currentDate, '$gte': sinceDate } });
  });

  EventModel.find({ '$or':orConditions }).sort({ created: -1 }).populate([{
    path: 'alert',
    select: 'name value rule smsEnabled emailEnabled messengerEnabled shortHash'
  }]).populate('paramData').populate('adsetData').exec(function (err, nEvents) {
    console.log(err);
    if (err) {
      return handleError(err);
    }
    var messages = {
      messenger: '',
      sms: '',
      email: ''
    };
    if (nEvents.length > 0) {
      var adsetsIds = [];
      nEvents = lodash.groupBy(nEvents, 'alert._id');
      for (var key in nEvents) {
        if (nEvents.hasOwnProperty(key)) {
          var groupedEvents = nEvents[key];
          if (groupedEvents.length > 0) {
            var title = groupedEvents[0].alert.name + '\n';  //Get name of alert
            var disable = 'To disable this alert, type: @disable:' + groupedEvents[0].alert.shortHash.toString() + ' \n';
            if(groupedEvents[0].alert.smsEnabled) messages.sms += title;
            if(groupedEvents[0].alert.emailEnabled) messages.email += title;
            if(groupedEvents[0].alert.messengerEnabled) messages.messenger += title;
            for (var i = 0; i < groupedEvents.length; i++) {
              var nEvent = groupedEvents[i];
              var message = 'For ' + nEvent.adsetData[0].adset_name + '\n' + 'triggered an alert at ' + moment(nEvent.created, 'YYYY-M-DD HH:mm:ss').format('HH:mm:ss') + '\n' + 'because ' + nEvent.param + ' is ' + Number(nEvent .value).toFixed(2) + ' ' + nEvent.alert.rule + ' ' + nEvent.alert.value + '\n';
              if(nEvent.alert.smsEnabled) messages.sms += message;
              if(nEvent.alert.emailEnabled) messages.email += message;
              if(nEvent.alert.messengerEnabled) messages.messenger += message;
              adsetsIds.push(nEvent.adset);

              if(nEvent.alert.smsEnabled) messages.sms += disable;
              if(nEvent.alert.emailEnabled) messages.email += disable;
              if(nEvent.alert.messengerEnabled) messages.messenger += disable;
            }
          }
        }
      }
      prepareDataAndSend(alerts.idsArr, lodash.uniq(adsetsIds), user, messages, eventIds);
    }
  });
}

function createPerfomedEventsBatch(alerts, user){
  EventModel.collection.insert(alerts.performedAlerts, function(err, docs){
    if(err){
      Logs.error(Logs.CRON_SERVICE, 'Batch insert events error', err);
      return;
    }
    sendNotification(alerts, user, docs.insertedIds);
  });
}

/***
 * Updates alert cron_updated field
 * @param alerts
 */
function updateAlertCronDate(alertsIds) {
  Alert.update({ _id: { '$in': alertsIds } }, { cron_updated: new Date().toISOString() }, { multi: true }, function (err, docs) {
  });
}

/***
 * Checks need or not need to notify user
 * @param alert - alert data
 * @returns {boolean}
 */
function checkTimePeriod(alert) {
  if(!alert.cron_updated){
    return true;
  }
  var cronDate = moment(alert.cron_updated, 'YYYY-M-DD HH:mm:ss');
  var d = new Date();
  var currentDate = moment(d, 'YYYY-M-DD HH:mm:ss');
  var minutesDiff = currentDate.diff(cronDate, 'minutes');
  minutesDiff = minutesDiff + 1;
  if (alert.period <= minutesDiff) {
//  if (0 <= minutesDiff) {
    return true;
  }
  return false;
}

function checkRulePerfomed(alertConditions){
  switch (alertConditions.rule) {
    case '==':
      if (parseFloat(alertConditions.value) === parseFloat(alertConditions.fbValue)) {
        return 1;
      } else {
        return false;
      }
      break;
    case '>':
      if (parseFloat(alertConditions.value) < parseFloat(alertConditions.fbValue)) {
        return 1;
      } else {
        return false;
      }
      break;
    case '<':
      if (parseFloat(alertConditions.value) > parseFloat(alertConditions.fbValue)) {
        return 1;
      } else {
        return false;
      }
      break;
    case '>=':
      if (parseFloat(alertConditions.value) <= parseFloat(alertConditions.fbValue)) {
        return 1;
      } else {
        return false;
      }
      break;
    case '<=':
      if (parseFloat(alertConditions.value) >= parseFloat(alertConditions.fbValue)) {
        return 1;
      } else {
        return false;
      }
      break;
    case '!=':
      if (parseFloat(alertConditions.value) !== parseFloat(alertConditions.fbValue)) {
        return 1;
      } else {
        return false;
      }
      break;
    default:
      return null;
  }

}

function createEvents(alerts) {
  var performedAlerts = [];
  var performedAlertsIds = [];
  var notPerformedAlerts = [];
  alerts.adsetsData.forEach(function(alert){
    delete alert.created;
    delete alert.paramLabel;

    var rulePerformed = checkRulePerfomed(alert);
    if(rulePerformed){
      var performedAlert = alert;
      performedAlert.value = alert.fbValue;
      delete performedAlert.fbValue;
      // delete performedAlert.cron_updated;
      performedAlert.created = moment().toDate();
      performedAlert.rulePerfomed = rulePerformed;
      if(checkTimePeriod(alert)) {
        delete performedAlert.cron_updated;
        performedAlerts.push(performedAlert);
        performedAlertsIds.push(mongoose.Types.ObjectId(performedAlert.alert));
      } else {
        createEvent(performedAlert);
      }
    }else {
      alert.value = alert.fbValue;
      delete alert.fbValue;
      createEvent(alert);
      var cronDate = moment(alert.cron_updated, 'YYYY-M-DD HH:mm:ss');
      var d = new Date();
      var currentDate = moment(d, 'YYYY-M-DD HH:mm:ss');
      alert.minutesDiff = currentDate.diff(cronDate, 'minutes');
      notPerformedAlerts.push(alert);
    }
  });
  if(performedAlerts.length > 0){
    var alertsObj  = {};
    updateAlertCronDate(performedAlertsIds);
    alertsObj.idsArr = performedAlertsIds;
    alertsObj.performedAlerts = performedAlerts;
    createPerfomedEventsBatch(alertsObj, alerts.user);
  }else {
    Logs.warning(Logs.CRON_SERVICE, 'There are no alerts to notify user', notPerformedAlerts);
  }
}


/***
 * Change event status to 1
 * @param eventId
 */
function updateEventStatus(eventId) {
  EventModel.update({ _id: eventId }, { rulePerfomed: '1' }, { multi: true }, function (err, docs) {
  });
}

/***
 * Creates document in model message that contain data about sended to user notification
 * @param notAttrs - notification data
 */
function createNotification(notAttrs) {
  Message.create(notAttrs, function (err, doc) {
    if (err) return handleError(err);
  });
}

/***
 * Sends email to user
 * @param emailParams - email data
 * @param callback - function that receive status of email
 */
function sendEmail(emailParams, callback) {
  var nodemailer = require('nodemailer');
    // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport(config.smtp);
    // send mail with defined transport object
  transporter.sendMail(emailParams, function (error, info) {
    if (error) {
      console.log(error);
      callback(false);
      return;
    }
    callback(true);
  });
}

/***
 * Sends message to facebook messenger
 * @param messageData - data for message
 * @param callback - function that receive status of message
 */
function sendMessNotification(messageData, callback) {
  fbRequester.sendMessengerNotification(messageData, callback);
}

/***
 * Handle response from facebook
 * @param freshData - data from facebook response
 * @param alerts - data of alerts
 */

function handleFbReponseAndSendNotification(freshData, alerts) {
  if(Object.keys(freshData).length === 0){
    Logs.error(Logs.CRON_SERVICE, 'Error', freshData);
    return;
  }
  var newAdsetData = [];
  alerts.adsetsData.forEach(function(alertCondition, index){
    var adsetId = alertCondition.adset;
    var adsetParam = alertCondition.param;

    if(adsetId in freshData && freshData[adsetId].data && freshData[adsetId].data.length > 0 && (adsetParam in freshData[adsetId].data[0])){
      alertCondition.fbValue = freshData[adsetId].data[0][adsetParam];
      newAdsetData.push(alertCondition);
    }else{
      alertCondition.value = 'Empty facebook response';
      createEvent(alertCondition);
    }
  });
  alerts.adsetsData = newAdsetData;
  createEvents(alerts);
}

/***
 *Makes Request to facebook, get data for active alerts and pass them to handler
 */
function getDataFromFB() {
  Alert.aggregate([
        { '$match': { 'status': '1' } },
    {
      '$group': {
        _id: '$user',
        adsetsArr: { '$push': '$typeId' },
        alertsIds: { '$push': '$_id' },
        adsetsData: {
          '$push': {
            'user':'$user',
            'alert': '$_id',
            'adset': '$typeId',
            'rule': '$rule',
            'value': '$value',
            'param': '$param',
            'paramLabel': '$paramLabel',
            'period': '$period',
            'created': '$created',
            'cron_updated': '$cron_updated'
          }
        }
      }
    }
  ]).exec(function (err, usersAlerts) {
    if (err) return handleError(err);
    usersAlerts.forEach(function (userAlert, index) {
      User.findOne({ '_id': userAlert._id }).exec(function (err, user) {
        if (err) return handleError(err);
        userAlert.user = user;
        Logs.info(Logs.CRON_SERVICE, 'Data prepared for fb user request', userAlert);
        fbRequester.getAdsetsInsights(userAlert, handleFbReponseAndSendNotification);
      });
    });
  });
}

/***
 * Initiate requests to facebook graph api
 */



cron.prototype.start = function () {
  setInterval(function () {
    getDataFromFB();
  }, REQUEST_PERIOD);
};

module.exports = cron;


