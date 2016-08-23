(function () {
  'use strict';

  angular
    .module('messages')
    .controller('MessagesListController', MessagesListController);

  MessagesListController.$inject = ['MessagesService', '$http'];

  function MessagesListController(MessagesService, $http) {
    var vm = this;

    vm.messages = MessagesService.query();
    // console.log(vm.messages);
    vm.init = {
      'count': 25,
      'page': 1,
      'sortBy': 'created',
      'sortOrder': 'dsc'
    };

    vm.filterBy = {
      'name':'',
      'adset_name':'',
      'adset_id': '',
      'status': '',
      'type': '',
      'message': '',
      'user': '',
      'created': ''
    };

    vm.notSortBy = [
      'name',
      'adset_name',
      'adset_id',
      'user'
    ];

    vm.getResource = function (params, paramsObj) {

      var sortVal = '';
      if (paramsObj.sortOrder === 'dsc') {
        sortVal = '-' + paramsObj.sortBy;

      } else if(paramsObj.sortOrder === 'asc') {
        sortVal = paramsObj.sortBy;
      }
      paramsObj.sort=sortVal;
      var urlApi = '/api/messages/';
      return $http.get(urlApi, { params:paramsObj }).then(function (response) {
        return {
          'rows': response.data.rows,
          'header': response.data.header,
          'pagination': response.data.pagination,
          'sortBy': response.data['sort-by'],
          'sortOrder': response.data['sort-order']
        };
      });
    };
  }
})();
