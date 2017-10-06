'use strict';

angular.module('vendingApp')

.service('StateService', ['MessageService', 'InventoryService', 'CashService',
  'COINS', 'STATES',
  function (MessageService, InventoryService, CashService, COINS, STATES) {

    var self = this;
    this.state = '';

    this.setIdle = function(){
      this.state = STATES.IDLE;
      onIdle();
    };

    this.setMoney = function(){
      this.state = STATES.MONEY;
    };

    this.setDisabled = function(){
      this.state = STATES.DISABLED;
    };

    var onIdle = function(){
      MessageService.idle();
      if (InventoryService.getRowTotal(1)) {
        if ((CashService.getCoinTotal(COINS.NICKEL.label) < 2) &&
            (CashService.getCoinTotal(COINS.DIME.label) < 1)) {
              MessageService.idleLowCash();
              return;
        }
      } else if (InventoryService.getRowTotal(0) ||
                 InventoryService.getRowTotal(2)) {
         if (CashService.getCoinTotal(COINS.NICKEL.label) < 1) {
           MessageService.idleLowCash();
           return;
         }
      } else {
        MessageService.noMessage();
        self.setDisabled();
      }
    };

}]);
