/**
 * Created by eugen on 29/07/16.
 */
'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  LogsClass = require(path.resolve('./modules/logs')),
  Logs = new LogsClass(),
  FbRequesterClass = require(path.resolve('./modules/fbrequester')),
  fbRequester = new FbRequesterClass(),
  lodash = require('lodash'),
  Alert = mongoose.model('Alert'),
  Adset = mongoose.model('Adset'),
  Appsetting = mongoose.model('Appsetting'),
  User = mongoose.model('User');

var moment = require('moment');

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've
 * created. If we receive a message with an attachment (image, video, audio),
 * then we'll simply confirm that we've received the attachment.
 *
 */
var MESSAGES = {
  internalErrorUser:'Internal error. Error get user data!',
  registerMessageForExistingUser:'Hi %name%! You can create new alerts using http://sha.red/2bkz3GH. Once that\'s done, I\'ll keep an eye on your Ad Campaigns and send you a notification anytime one of your alerts gets triggered.',
  registerMessageForNewUser:'Hi. I\'m an AutoBot. To register for Ad alerts, type ID:<your facebook id> You can find your Facebook ID by signing into the web app and going to your profile page http://sha.red/2bkzOzD.',
  internalErrorAlert : 'Internal error. Invalid Alert ID!',
  alertDisabled : 'Alert #%alert_id% is now disabled. I will stop monitoring Ad Set "%adset_name%" to check if %tracking_param% is %rule% %value%',
  internalUnknownError :'Unknown Error!',
  authSuccess:'Authentication successful',
  authNoUser:'There is no user with such id',

};

/*var ERROR_GET_USER_DATA = global.appSettings.internalErrorUser ||'Internal error. Error get user data!';
var REGISTERED_MESSAGE = global.appSettings.registerMessageForExistingUser || 'Hi %name%! You can create new alerts using http://sha.red/2bkz3GH. Once that\'s done, I\'ll keep an eye on your Ad Campaigns and send you a notification anytime one of your alerts gets triggered.';
var NOT_REGISTERED_MESSAGE = global.appSettings.registerMessageForNewUser || 'Hi. I\'m an AutoBot. To register for Ad alerts, type ID:<your facebook id> You can find your Facebook ID by signing into the web app and going to your profile page http://sha.red/2bkzOzD.';
var ERROR_GET_ALERT = global.appSettings.internalErrorAlert || 'Internal error. Invalid Alert ID!';
var ALERT_DISABLED =  global.appSettings.alertDisabled || 'Alert #%alert_id% is now disabled. I will stop monitoring Ad Set "%adset_name%" to check if %tracking_param% is %rule% %value%';
var ERROR_UNKNOWN = global.appSettings.internalUnknownError ||'Unknown Error!';
*/

var messengerService = function (event) {

};



/**
 * Send a text message using the Send API.
 *
 */
var sendTextMessage = function (recipientId, messageText) {


  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
            // metadata: 'DEVELOPER_DEFINED_METADATA'
    }
  };

  fbRequester.sendMessengerNotification(messageData);
};


/**
 * prepare message for reply based on settings
 */

var prepareAndSendMessage = function (recipientId, settingsKey, user) {
  Appsetting.findOne({ 'name': settingsKey }).exec(
      function (err, appsetting) {
        var message = '';
        if (!err && appsetting) {
          message = appsetting.value;
          console.log('message for key '+settingsKey+' from db: ' + message);
        }else if(settingsKey in MESSAGES){
          console.log('message for key '+settingsKey+' from object: ' + message);
          message = MESSAGES[settingsKey];
        }else {
          console.log('message for key '+settingsKey+' from nothing: ' + message);
        }
        if (user !== null) {
          message = message.replace('%name%', user.firstName);
        }
        sendTextMessage(recipientId, message);
        return;
      });



};


/***
 * Handle response from facebook , prepare message text, send messsage
 * @param fbData - data returned by facebook
 * @param alertsData - alert data
 */
var fbResponseHandler = function (fbData, alertsData) {
  alertsData.adsetsData.forEach(function (adsetData,index) {
    var refreshedDataMess = '';
    var adsetId = adsetData.id;
    Adset.findOne({ 'adset_id': adsetId }).exec(function(err, adset) {
      var adsetName = adset ? adset.adset_name : '';
      if (fbData && fbData[adsetId] && fbData[adsetId].data && fbData[adsetId].data.length > 0 && (adsetData.param in fbData[adsetId].data[0])){
        var fbValue = fbData[adsetId].data[0][adsetData.param];
        var date = new Date();
        refreshedDataMess += ('Update for For ' + adsetName + '\n' + 'time is ' + moment(date.toISOString(), 'YYYY-M-DD HH:mm:ss').format('YYYY.MM.DD HH:mm:ss') + '\n' + adsetData.param + ' is ' + Number(fbValue).toFixed(2) + '\n \n');
      }
      var message = 'Empty dataset was returned by Facebook API';
      if(refreshedDataMess.length !== ''){
        message = refreshedDataMess;
      }
      Logs.info(Logs.WEBHOOK, message, alertsData.user.messengerId);
      sendTextMessage(alertsData.user.messengerId, message);
    });

  });

};

/***
 * Gets alerts 
 * @param messengerId
 */
var getUserActivetrackingData = function (messengerId) {
    // Array for active alerts
  var alertsToCheck = [];
    // Gets active alerts

  User.findOne({
    'messengerId': messengerId
  }).exec(
        function (err, user) {
          if (err && !user) {
            sendTextMessage(messengerId, MESSAGES.registerMessageForNewUser);
            Logs.error(Logs.WEBHOOK, 'Error find user by messenger id',err);
            return;
          }

          if (user === null) {
            console.log('Here I am sending null user');
            return;
          }

          Alert.aggregate([{
            '$match': {
              'status': '1',
              'user': user._id
            }
          }, {
            '$group': {
              _id: '$user',
              adsetsArr: {
                '$push': '$typeId'
              },
              alertsIds: {
                '$push': '$_id'
              },
              adsetsData: {
                '$push': {
                  'alertId': '$_id',
                  'id': '$typeId',
                  'rule': '$rule',
                  'value': '$value',
                  'param': '$param',
                  'paramLabel': '$paramLabel'
                }
              }
            }
          }]).exec(
                function (err, userAggregatedAlertData) {
                  if (err) {
                    sendTextMessage(messengerId, MESSAGES.internalErrorUser);
                    Logs.error(Logs.WEBHOOK, 'Error aggregate user data', err);
                    return;
                  }
                  if(userAggregatedAlertData.length === 0){
                    sendTextMessage(messengerId, MESSAGES.registerMessageForExistingUser.replace('%name%', user.displayName));
                    Logs.info(Logs.WEBHOOK, MESSAGES.registerMessageForExistingUser.replace('%name%', user.displayName), messengerId);
                    return;
                  }
                  userAggregatedAlertData.forEach(function (alertData, index) {
                    alertData.user = user;
                    fbRequester.getAdsetsInsights(alertData,
                            fbResponseHandler);
                  });
                });
        });
};

/***
 * Handles "@register@ message
 * @param messengerId
 */
var getUserRegisterStatus = function (messengerId) {

  User.findOne({
    'messengerId': messengerId
  }).exec(
      function (err, user) {
        if (err && !user) {
          Logs.error(Logs.WEBHOOK, 'Error find user by messenger id',err);
          return;
        }
        if (user === null) {

          prepareAndSendMessage(messengerId, 'registerMessageForNewUser', user);
          return;

        }

        prepareAndSendMessage(messengerId, 'registerMessageForExistingUser', user);
        return;


      });
};

/***
 * Handles "@disable:<alert_id>" message
 * @param alertId
 * @param messengerId
 */
var disableAlert = function (alertHash, messengerId) {

  User.findOne({
    'messengerId': messengerId
  }).exec(
      function (err, user) {
        if (err && !user) {
          Logs.error(Logs.WEBHOOK, 'Error find user by messenger id',err);
          return;
        }
        if (user === null) {
          sendTextMessage(messengerId, MESSAGES.registerMessageForNewUser);
          return;
        }
        Alert.findOne({ shortHash: alertHash }).populate('adsetData').exec(function(error, alert){
          if (!alert) {
            sendTextMessage(messengerId, MESSAGES.internalErrorAlert);
            return;
          }
          alert.status = 0;
          alert.save(function(saveError, res){
            if(saveError)
            {
              Logs.error(Logs.WEBHOOK, 'Saving Alert Error',saveError);
              sendTextMessage(messengerId, MESSAGES.internalUnknownError);
            }
            var messageData = [
              {
                param: 'adset_name',
                value: alert.adsetData[0].adset_name ? alert.adsetData[0].adset_name : 'NOT DEFINED'
              },
              {
                param: 'alert_id',
                value:alertHash
              },
              {
                param: 'tracking_param',
                value: alert.paramLabel
              },
              {
                param: 'rule',
                value: alert.rule
              },
              {
                param: 'value',
                value: alert.value
              }
            ];
            var message = MESSAGES.alertDisabled;
            messageData.forEach(function(placeholder){
              message = message.replace('%'+placeholder.param+'%', placeholder.value);

            });
            sendTextMessage(messengerId, message);

          });
        });

      });
};

/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to
 * Messenger" plugin, it is the 'data-ref' field. Read more at
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
 *
 */
messengerService.prototype.receivedAuthentication = function(event){
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfAuth = event.timestamp;

  // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
  // The developer can set this to an arbitrary value to associate the
  // authentication callback with the 'Send to Messenger' click event. This is
  // a way to do account linking when the user clicks the 'Send to Messenger'
  // plugin.
  var userId = event.optin.ref;

  console.log('Received authentication for user %d and page %d with pass ' +
      'through param \'%s\' at %d', senderID, recipientID, userId,
      timeOfAuth);
  if(userId){
    User.findOne({ 'providerData.id': userId }).exec(function (err, user) {
      if (err) {
        Logs.error(Logs.WEBHOOK, 'Error find user by id', err);
        prepareAndSendMessage(senderID, 'authNoUser');
        return;
      }

      if (user) {
        Logs.info(Logs.WEBHOOK, 'User successfuly subscribed for bot', userId);
        // When an authentication is received, we'll send a message back to the sender
        // to let them know it was successful.
        prepareAndSendMessage(senderID, 'authSuccess');
        user.messengerId = senderID;
        user.save(function (err) {
          if (err) {
            Logs.error(Logs.WEBHOOK, 'Error save to DB', err);
            return;
          }
          Logs.info(Logs.WEBHOOK, 'Sender Id succesfully added to db', userId);
        });
      } else {
        Logs.info(Logs.WEBHOOK, 'There is no user with such id', userId);
        prepareAndSendMessage(senderID, 'authNoUser');
      }
    });
  }
};

messengerService.prototype.receiveMessage = function (event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  /*console.log('Received message for user %d and page %d at %d with message:',
        senderID, recipientID, timeOfMessage);*/

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

    // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;
  if (isEcho) {
        // Just logging message echoes to console
    console.log('Received echo for message %s and app %d with metadata %s',
            messageId, appId, metadata);
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log('Quick reply for message %s with payload %s',
            messageId, quickReplyPayload);
    sendTextMessage(senderID, 'Quick reply tapped');
    return;
  }
  if (messageText) {
    if (messageText.match(/ID:\d{6,}/g)) {
      var userId = messageText.split(':')[1];
      User.findOne({ 'providerData.id': userId }).exec(function (err, user) {
        if (err) {
          Logs.error(Logs.WEBHOOK, 'Error find user by id', err);
          sendTextMessage(senderID, 'There is no user with such id');
          return;
        }

        if (user) {
          Logs.info(Logs.WEBHOOK, 'User successfuly subscribed for bot', userId);
          sendTextMessage(senderID, 'You successfully subscribed for bot');
          user.messengerId = senderID;
          user.save(function (err) {
            if (err) {
              Logs.error(Logs.WEBHOOK, 'Error save to DB', err);
              return;
            }
            Logs.info(Logs.WEBHOOK, 'Sender Id succesfully added to db', userId);
          });
        } else {
          Logs.info(Logs.WEBHOOK, 'There is no user with such id', messageText);
          sendTextMessage(senderID, 'There is no user with such id');
        }
      });
    } else if (messageText === '@update') {
      getUserActivetrackingData(senderID);
    }
    else if (messageText === '@register') {
      getUserRegisterStatus(senderID);
    }
    else if (messageText.match(/@disable:\w*/g)) {
      var alertHash = messageText.split(':')[1];
      disableAlert(alertHash, senderID);
    }

        //Logs.info(Logs.WEBHOOK, 'Invalid User Id', messageText);

        /* else if (messageAttachments) {
         sendTextMessage(senderID, "Message with attachment received");
         }*/
  }
};

/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
messengerService.prototype.receivedDeliveryConfirmation = function (event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var delivery = event.delivery;
  var messageIDs = delivery.mids;
  var watermark = delivery.watermark;
  var sequenceNumber = delivery.seq;

  if (messageIDs) {
    messageIDs.forEach(function (messageID) {
      console.log('Received delivery confirmation for message ID: %s',
                messageID);
    });
  }

  console.log('All message before %d were delivered.', watermark);
};

module.exports = messengerService;
