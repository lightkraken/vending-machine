'use strict';

angular.module('vendingApp')

.service('MessageService', ['MESSAGES', '$filter', '$timeout',
  function (MESSAGES, $filter, $timeout) {
    this.message = {text: ''};

    this.idle = function(){
      this.message.text = MESSAGES.INSERTCOIN;
    };

    this.idleLowCash = function(){
      this.message.text = MESSAGES.EXACTCHANGE;
    };

    this.totalCredit = function(total){
      this.message.text = $filter('centsToDollars')(total);
    };

    this.noMessage = function(){
      this.message.text = '';
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
        if (revert) {oldMessage = self.message.text;}
      }

      self.message.text = newMessage;

      timer = $timeout(function(){
        notifying = false;
        if (revert) {
          self.message.text = oldMessage;
        }
      }, 1000);

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
