'use strict';

angular.module('vendingApp')

.service('MessageService', ['MESSAGES', '$filter', '$timeout',
  function (MESSAGES, $filter, $timeout, $q) {
    this.message = '';

    this.idle = function(){
      this.message = MESSAGES.INSERTCOIN;
    };

    this.idleLowCash = function(){
      this.message = MESSAGES.EXACTCHANGE;
    };

    this.totalCredit = function(total){
      this.message = $filter('centsToDollars')(total);
    };

    this.noMessage = function(){
      this.message = '';
    };

    var self = this;
    var timer;
    var oldMessage;
    var notifying = false;

    var notify = function(newMessage, revert) {
      if (notifying) {
        $timeout.cancel(timer);
      } else {
        notifying = true;
        if (revert) {oldMessage = self.message;}
      }

      self.message = newMessage;

      timer = $timeout(function(){
        notifying = false;
        if (revert) {self.message = oldMessage;}
      }, 3000);

      return timer;
    };

    this.notifySoldOut = function(){
      notify(MESSAGES.SOLDOUT, true);
    };

    this.notifyPrice = function(price){
      var message = MESSAGES.PRICE + ' ' + $filter('centsToDollars')(price);
      notify(message, true);
    };

    this.notifyThankYou = function(){
      return notify(MESSAGES.THANKYOU);
    };

}]);
