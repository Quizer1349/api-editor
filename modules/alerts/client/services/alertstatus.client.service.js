(function () {
  'use strict';

  angular
        .module('alerts')
        .factory('AlertStatusService', AlertStatusService);

  function AlertStatusService() {
    var factObj = {
      getStatusList: function(){
        return [{ value:'0', name:'Disabled' }, { value:'1', name: 'Enabled' }];
      }
    };
    return factObj;
  }
})();
