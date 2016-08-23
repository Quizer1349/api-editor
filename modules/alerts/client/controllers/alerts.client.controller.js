(function () {
  'use strict';

  // Alerts controller
  angular
    .module('alerts')
    .controller('AlertsController', AlertsController);

  AlertsController.$inject = ['$scope', '$state', '$http','Authentication', 'alertResolve', 'ParamsService', 'lodash', 'AlertStatusService', 'Alerts', 'AdsetsService', 'AdaccountsService', '$filter'];
  function AlertsController ($scope, $state, $http, Authentication, alert, ParamsService, lodash, AlertStatusService, Alerts, AdsetsService, AdaccountsService, $filter) {
    var vm = this;
    vm.authentication = Authentication;
    vm.alert = alert;
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.trackingParams ={};
    vm.adsets = {};
    vm.alert.typeId = alert.typeId;
    // vm.trackingparams='';

    vm.alertRules = [
      { value:'==', name:'Equal' },
      { value:'>', name:'Greater Than' },
      { value:'>=', name:'Greater Or Equal' },
      { value:'<', name:'Less Than' },
      { value:'<=', name:'Less Or Equal' },
      { value:'!=', name:'Not Equal' }
    ];
    vm.alert.rule = lodash.find(vm.alertRules, { value: vm.alert.rule ? vm.alert.rule : '==' });
    vm.alertPeriods = Alerts.periods;
    vm.alert.period = lodash.find(vm.alertPeriods, { value: vm.alert.period ? vm.alert.period : '5' });
    vm.alertStatus = AlertStatusService.getStatusList();
    vm.alert.status = lodash.find(vm.alertStatus, { value: vm.alert.status ? vm.alert.status : '1' });

    $scope.generateName = function()
    {

      var preparedName = $scope.getAdsetName() + ': ';
      preparedName += vm.alert.param.name + ' ';
      preparedName += vm.alert.rule.value + ' ';
      preparedName += (vm.alert.value !==undefined ? vm.alert.value : '') ;
      vm.alert.name = preparedName;
    };

    if(!vm.alert._id)
    {
      vm.alert.emailEnabled = true;
      vm.alert.messengerEnabled = true;
      vm.alert.smsEnabled = false;
      vm.alert.adaccount_id = null;
    }

    ParamsService.getParams().then(function(params){

      vm.trackingParams =  params;
      params.forEach(function(param){
        if(param.name === vm.alert.paramLabel) {
          vm.alert.param = param;
          $scope.generateName();
        } else {
          vm.alert.param = params[0];
          $scope.generateName();
        }
      });
    });


    // Selects
    $scope.adsets = [];
    $scope.adAccounts = [];
    $scope.preparedAdSets = [];
    $scope.preparedAdAccounts = [];
    $scope.accountsActiveOnly = false;
    $scope.adsetsActiveOnly = false;
    AdaccountsService.query(function (data) {
      $scope.adAccounts = data;
      $scope.preparedAdAccounts = data;

    });

    AdsetsService.query(function (data) {
      $scope.adSets = data;
      $scope.preparedAdSets = data;

    });

    $scope.changeAdaccount = function()
    {
      vm.alert.typeId = null;
      $scope.preparedAdSets = $filter('propsFilter')($scope.adSets, { 'adaccount_id' : vm.alert.adaccount_id });
      $scope.preparedAdSets = $scope.adsetsActiveOnly ? $filter('propsFilter')($scope.preparedAdSets, { 'status' : 'ACTIVE' }) : $scope.preparedAdSets;
    };

    $scope.activeAccountsChange = function()
    {
      vm.alert.adaccount_id = null;
      vm.alert.typeId = null;
      $scope.preparedAdAccounts = $scope.accountsActiveOnly ? $filter('propsFilter')($scope.preparedAdAccounts, { 'status' : '1' }) : $scope.preparedAdAccounts;
    };


    $scope.getAdsetName = function(){
      var name = '';
      angular.forEach($scope.adSets, function (row) {
        if(vm.alert.typeId === row.adset_id)
          name = row.adset_name;
      });
      return name;
    };

    // Save Alert
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.alertForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.alert._id) {
        vm.alert.$update(successCallback, errorCallback);
      } else {
        vm.alert.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('alerts.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
