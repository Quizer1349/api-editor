//Patams service used to communicate Alerts REST endpoints
//TODO find our how to get info from service no from $http
(function () {
  'use strict';

  angular
    .module('alerts')
    .factory('ParamsService', ParamsService);

  ParamsService.$inject = ['$http'];

  function ParamsService($http) {

    var factObj = {

      getParams: function(){
        return $http.get('/api/trackingparams').then(function(r){
          return r.data.rows;
        });
      }

    };

    return factObj;
  }
})();
