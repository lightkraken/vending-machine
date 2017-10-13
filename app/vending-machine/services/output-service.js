'use strict';

angular.module('vendingApp')

.service('OutputService', [
  function (){
    var self = this;
    this.returnedItems = [];
    this.dispensedItems = [];

    this.returnItems = function(items) {
      if (_.isArray(items)) {
        _.each(items, function(item){
          self.returnedItems.push(item);
        });
      } else {
        self.returnedItems.push(items);
      }
    };

    this.dispenseItem = function(item) {
      self.dispensedItems.unshift(item);
    };
}]);
