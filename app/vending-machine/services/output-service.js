'use strict';

angular.module('vendingApp')

.service('OutputService', ['SoundService',
  function (SoundService){
    var self = this;
    this.returnedItems = [];
    this.dispensedItems = [];

    this.returnItems = function(items) {
      if (_.isArray(items)) {
        _.each(items, function(item){
          self.returnedItems.push(item);
        });
        if (items.length > 1) {
          SoundService.returnMultipleCoins.play();
        } else if (items.length) {
          SoundService.returnSingleCoin.play();
        }
      } else {
        self.returnedItems.push(items);
        SoundService.returnSingleCoin.play();
      }
    };

    this.dispenseItem = function(item) {
      self.dispensedItems.unshift(item);
    };
}]);
