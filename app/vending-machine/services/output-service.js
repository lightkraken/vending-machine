'use strict';

angular.module('vendingApp')

.service('OutputService', [
  function (){
    this.returnedItems = [];
    this.dispensedItems = [];

    this.returnItems = function(items) {
      if (_.isArray(items)) {
        this.returnedItems = this.returnedItems.concat(items);
      } else {
        this.returnedItems.push(items);
      }
    };

    this.dispenseItem = function(item) {
      this.dispensedItems.push(item);
    };
}]);
