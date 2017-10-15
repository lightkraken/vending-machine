'use strict';

angular.module('vendingApp')

.service('SelectService', ['SoundService', 'InventoryService', 'MessageService', 'CashService',
         'OutputService', 'StateService', 'STATES', 'PRICES',
  function (SoundService, InventoryService, MessageService, CashService,
            OutputService, StateService, STATES, PRICES) {

    var chooseItem = function(row, column){
      SoundService.numpad.play();
      if (InventoryService.inStock(row, column)) {
        return true;
      } else {
        MessageService.notifySoldOut();
        return false;
      }
    };

    var idleChooseItem = function(row, column){
      if (chooseItem(row, column)) {
        MessageService.notifyPrice(PRICES[row]);
      }
    };
    
    var moneyChooseItem = function(row, column){
      if (chooseItem(row, column)) {
        if(CashService.getTotalCredit() < PRICES[row]) {
          MessageService.notifyPrice(PRICES[row]);
        } else {
          var change = CashService.pay(PRICES[row]);
          if (change) {
            OutputService.returnItems(change);
          }
          OutputService.dispenseItem(row, column);
        }
      }
    };

    this.chooseItem = function(row, column){
      switch (StateService.state.currentState) {
        case STATES.IDLE:
          idleChooseItem(row, column);
          break;
        case STATES.MONEY:
          moneyChooseItem(row, column);
          break;
      }
    };

}]);
