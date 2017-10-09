'use strict';

angular.module('vendingApp')

.service('OutputService', ['$rootScope', 'BROADCASTS',
  function ($rootScope, BROADCASTS){
    this.returnedItems = [];
    this.dispensedItems = [];

    this.returnItems = function(items) {
      if (_.isArray(items)) {
        this.returnedItems = this.returnedItems.concat(items);
      } else {
        this.returnedItems.push(items);
      }
      $rootScope.$broadcast(BROADCASTS.RETURNED);
    };

    this.dispenseItem = function(item) {
      this.dispensedItems.push(item);
      $rootScope.$broadcast(BROADCASTS.DISPENSED);
    };
}]);
