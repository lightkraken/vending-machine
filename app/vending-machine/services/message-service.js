'use strict';

angular.module('vendingApp')

.service('MessageService', ['MESSAGES', 'BROADCASTS', '$rootScope', '$filter', '$timeout',
  function (MESSAGES, BROADCASTS, $rootScope, $filter, $timeout, $q) {
    this.message = '';

    var messageUpdated = function(){
      $rootScope.$broadcast(BROADCASTS.MESSAGE);
    };

    this.idle = function(){
      this.message = MESSAGES.INSERTCOIN;
      messageUpdated();
    };

    this.idleLowCash = function(){
      this.message = MESSAGES.EXACTCHANGE;
      messageUpdated();
    };

    this.totalCredit = function(total){
      this.message = $filter('centsToDollars')(total);
      messageUpdated();
    };

    this.noMessage = function(){
      this.message = '';
      messageUpdated();
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
      messageUpdated();

      timer = $timeout(function(){
        notifying = false;
        if (revert) {
          self.message = oldMessage;
          messageUpdated();
        }
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
