'use strict';

angular.module('vendingApp')

.service('StateService', ['MessageService', 'InventoryService', 'CashService',
  'COINS', 'STATES',
  function (MessageService, InventoryService, CashService, COINS, STATES) {

    var self = this;
    this.state = {currentState: ''};

    this.setIdle = function(){
      self.state.currentState = STATES.IDLE;
      onIdle();
    };

    this.setMoney = function(){
      self.state.currentState = STATES.MONEY;
    };

    this.setDisabled = function(){
      self.state.currentState = STATES.DISABLED;
    };

    var onIdle = function(){
      if (!InventoryService.getRowTotal(0) &&
          !InventoryService.getRowTotal(1) &&
          !InventoryService.getRowTotal(2)) {
        MessageService.noMessage();
        self.setDisabled();
        return;
      }
      if (!CashService.getCoinTotal(COINS.NICKEL.label)) {
        MessageService.idleLowCash();
        return;
      }
      if (InventoryService.getRowTotal(1)) {
        if (CashService.getCoinTotal(COINS.NICKEL.label) < 2 &&
            !CashService.getCoinTotal(COINS.DIME.label)) {
          MessageService.idleLowCash();
          return;
        }
      }
      MessageService.idle();
    };

}]);
