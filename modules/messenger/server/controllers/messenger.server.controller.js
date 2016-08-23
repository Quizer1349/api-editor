'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  LogsClass = require(path.resolve('./modules/logs')),
  Logs = new LogsClass(),
  MessengerService = require('../services/messenger.server.service.js'),
  messengerService = new MessengerService();  
/**
 * Validate Token
 */
exports.validateToken = function (req, res) {
  Logs.info('Webhook', 'Webhook query', res.query);
  if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === 'mediabuyer_token') {
    console.log('Validating webhook');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(200);
  }
};

/**
 * Handle callbacks
 */
exports.handleCallback = function (req, res) {
  var data = req.body;
  Logs.info('Webhook', 'Webhook callback query', req);
    // Make sure this is a page subscription
  if (data.object === 'page') {
        // Iterate over each entry
        // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;
            // Iterate over each messaging event
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.optin) {
          messengerService.receivedAuthentication(messagingEvent);
        }else if (messagingEvent.message) {
          messengerService.receiveMessage(messagingEvent);
        } else if (messagingEvent.delivery) {
          messengerService.receivedDeliveryConfirmation(messagingEvent);
        } else {
          console.log('Webhook received unknown messagingEvent: ', messagingEvent);
        }
      });
    });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've
        // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
};
