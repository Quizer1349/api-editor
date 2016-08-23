/**
 * Created by eugen on 06/07/16.
 */
'use strict';

/**
 * Module for app graph api requests.
 */

var moment = require('moment');

var FB = require('fb');
var LogsClass = require('../logs');
var Logs = new LogsClass();
var path = require('path');
var request = require('request');
var Config = require(path.resolve('./config/config'));
/***
 * Sets graph api version, define private error handlers and other functions
 * @constructor
 */

var FbRequester = function() {
  FB.options({ version: 'v2.6' });

  /***
   * Logs for unsuccessful graph api request
   * @param res - response from facebook
   * @param path - path of graph api request
   * @param params - params of graph api request
   * @param place - place where request was called
     */
  var logError = function(res, path, params, place){
    var message = !res ? 'error occurred' : res.error;
    var data = !res ? null : res;
    Logs.error(place, message + Logs.PHRASE_RESPONSE_FROM + path + 'Params is' + params, res);
  };

  /***
   * Handle unexpected errors
   * @param err - error object
   * @param path - path of graph api request
   * @param params - params of graph api request
   * @param place - place where request was called
     */
  var handleError = function(err, path, params, place){
    var errorObj = {};
    errorObj.path = path;
    errorObj.params = params;
    errorObj.stack = err.stack;
    Logs.error(Logs.FB_REQUESTER_INTERNAL_ERROR, err.message ? err.message: 'error occurred'+ ' ' + Logs.PHRASE_RESPONSE_FROM + path, errorObj);
  };

  /***
   * Make graph api requests without handling pagination
   * @param err - error object
   * @param path - path of graph api request
   * @param params - params of graph api request
   * @param callback - function where data will be handled
   * @param data - additional local data for callback handler
   * @param logPlace - place where request was called
     */
  this.makeSingleFbRequest = function (path, params, callback, data, logPlace) {
    try {
      FB.api(path, params, function (res) {
        if (!res || res.error) {
          logError(res, path, params, logPlace);
          return;
        }
        Logs.info(logPlace, Logs.PHRASE_RESPONSE_FROM + path, res);
        if (data) {
          callback(res, data);
        } else {
          callback(res);
        }
      });
    }catch (err){
      handleError(err, path, params, logPlace);
    }
  };

  /***
   * Make graph api requests with handling "cursor" pagination
   * @param err - error object
   * @param path - path of graph api request
   * @param params - params of graph api request
   * @param callback - function where data will be handled
   * @param logPlace - place where request was called
   */

  this.getPagingByCursorData = function (path, params, handler, callback, logPlace) {
    var dataArr = [];
    FB.api(path, params, paging_object);
    function paging_object(res) {
      try {
        if (!res || res.error) {
          logError(res, path, params, logPlace);
          return;
        }
        if (res.data.length > 0) {
          Logs.info(logPlace, Logs.PHRASE_RESPONSE_FROM + path, res.data);
          res.data.forEach(function (item, index) {
            dataArr.push(handler(item, index));
          });
        } else {
          callback(dataArr);
        }
        if (res.paging !== undefined && res.paging.cursors !== undefined && res.paging.cursors.after !== undefined) {
          params.after = res.paging.cursors.after;
          FB.api(path, params, paging_object);
        }
      } catch (err) {
        handleError(err, path, params, logPlace);
      }
    }
  };
};

/***
 * Makes graph api request for getting ad accounts, initialize path, params and handler for response
 * @param accessToken - User token for request
 * @param callback function - receiver of handled response
 */

FbRequester.prototype.getAdAccounts = function(accessToken, callback) {
  var path = 'me/adaccounts';
  var params = { fields: 'account_status, name', access_token: accessToken };
  var handler = function(item,index){
    return { account_id:item.id, status:item.account_status, account_name: item.name };
  };

  Logs.info(Logs.FB_REQUESTER_ACCOUNTS, Logs.PHRASE_REQUEST_TO + path, params);
  this.getPagingByCursorData(path,params,handler, callback, Logs.FB_REQUESTER_ACCOUNTS);
};

/***
 * Makes graph api request for getting adsets by account, initialize path, params and handler for response
 * @param adAccount - User Ad Account
 * @param accessToken - User token for request
 * @param callback function - receiver of handled response
 */

FbRequester.prototype.getAdsetsByAdAccount = function(adAccount,accessToken, callback) {
  var path = adAccount+'/adsets';
  var params = { fields: 'name,campaign{id,name},start_time,end_time,status,daily_budget,optimization_goal,id,insights{spend,reach}', access_token: accessToken };
  var handler = function(item,index){
    var adset = {};
    adset.camp_id = item.campaign.id;
    adset.camp_name = item.campaign.name;
    adset.amount_spent = item.insights && item.insights.data && item.insights.data.length > 0 ? item.insights.data[0].spend : 0;
    adset.reach = item.insights && item.insights.data && item.insights.data.length > 0 ? item.insights.data[0].reach : 0;
    adset.daily_budget = item.daily_budget/100;
    adset.adset_id = item.id;
    adset.adset_name = item.name;
    adset.status = item.status;
    adset.type = item.optimization_goal;
    adset.start_time = item.start_time;
    adset.end_time = item.end_time? item.end_time: 'Ongoing';
    adset.schedule = (moment(item.start_time, 'YYYY-M-DDTHH:mm:ss+-HH:mm').format('MMM D, YYYY')) + ' - ' + (item.end_time? moment(item.end_time, 'YYYY-M-DDTHH:mm:ss+-HH:mm').format('MMM D, YYYY'): 'Ongoing');
    adset.adaccount_id = adAccount;
    return adset;
  };

  Logs.info(Logs.FB_REQUESTER_ADSETS, Logs.PHRASE_REQUEST_TO + path, params);
  this.getPagingByCursorData(path,params,handler, callback, Logs.FB_REQUESTER_ADSETS);
};

/***
 * Makes graph api request for getting insights by adset, initialize path, params and handler for response
 * @param alerts - object that contain array of adsets for active alerts by one user
 * @param callback function - receiver of handled response
 */
FbRequester.prototype.getAdsetsInsights = function (alerts, callback) {
  var path = '/insights?ids=' + alerts.adsetsArr.toString();
  var params = { date_preset: 'lifetime', access_token: alerts.user.providerData.accessToken, fields:'total_actions, total_unique_actions, action_values, total_action_value, impressions, social_impressions, clicks, social_clicks, unique_impressions, unique_social_impressions, unique_clicks, unique_social_clicks, spend, frequency, social_spend, deeplink_clicks, app_store_clicks, website_clicks, cost_per_inline_post_engagement, inline_link_clicks, cost_per_inline_link_click, inline_post_engagement, unique_inline_link_clicks, cost_per_unique_inline_link_click, inline_link_click_ctr, unique_inline_link_click_ctr, call_to_action_clicks, newsfeed_avg_position, newsfeed_impressions, newsfeed_clicks, reach, social_reach, ctr, unique_ctr, unique_link_clicks_ctr, cpc, cpm, cpp, cost_per_total_action, cost_per_unique_click, cost_per_10_sec_video_view, relevance_score, website_ctr, video_avg_sec_watched_actions, video_avg_pct_watched_actions, video_p25_watched_actions, video_p50_watched_actions, video_p75_watched_actions, video_p95_watched_actions, video_p100_watched_actions, video_complete_watched_actions, video_10_sec_watched_actions, video_15_sec_watched_actions, video_30_sec_watched_actions, estimated_ad_recallers, estimated_ad_recallers_lower_bound, estimated_ad_recallers_upper_bound, estimated_ad_recall_rate, estimated_ad_recall_rate_lower_bound, estimated_ad_recall_rate_upper_bound, cost_per_estimated_ad_recallers, canvas_avg_view_time, canvas_avg_view_percent, place_page_name, ad_bid_type, ad_bid_value, ad_delivery, adset_bid_value, adset_budget_value, adset_delivery' };
  Logs.info(Logs.FB_REQUESTER_ADSETS_INSIGHTS, Logs.PHRASE_REQUEST_TO + path, params);
  this.makeSingleFbRequest(path, params, callback, alerts, Logs.FB_REQUESTER_ADSETS_INSIGHTS);
};

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 * @param messageData - object that contain senderId and Text
 * @param callback function - receiver of message status
 */
FbRequester.prototype.sendMessengerNotification = function(messageData, callback) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: Config.tokens.messengerSubscribedPageToken },
    method: 'POST',
    json: messageData
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;
      if (messageId) {
        Logs.info(Logs.MESSENGER, 'Successfully sent message with id '+messageId+' to recipient '+recipientId, { messageId:messageId, recipientId:recipientId });
        if(typeof(callback) === 'function') callback(true);
      } else {
        Logs.info(Logs.MESSENGER, 'Successfully called Send API for recipient '+recipientId, { messageId:messageId, recipientId:recipientId });
        if(typeof(callback) === 'function') callback(true);
      }
    } else {
      Logs.error(Logs.MESSENGER, 'Error sending message', response);
      if(typeof(callback) === 'function') callback(false);
    }
  });
};


module.exports = FbRequester;
