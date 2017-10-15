'use strict';

angular.module('vendingApp')

.service('InputService', ['CoinValidatorService', 'CashService', 'OutputService',
         'MessageService', 'StateService', 'SoundService', 'InventoryService',
         'STATES',
  function (CoinValidatorService, CashService, OutputService,
            MessageService, StateService, SoundService, InventoryService,
            STATES) {
    var self = this;

    var insertCoin = function(coin){
      var coinResult = CoinValidatorService.validateCoin(coin);
      if ((CashService.getTotalCredit() >= 100 || !coinResult)) {
        OutputService.returnItems([coin]);
        return false;
      } else {
        SoundService.insertValidCoin.play();
        CashService.insertCoin(coinResult, coin);
        MessageService.totalCredit(CashService.getTotalCredit());
        return true;
      }
    };

    var idleInsertCoin = function(coin){
      if (insertCoin(coin)) {
        StateService.setMoney();
      }
    };

    var disabledInstertCoin = function(coin){
      OutputService.returnItems([coin]);
    };

    this.slotContents = [];

    this.insertCoin = function(){
      var coin = self.slotContents.pop();
      CashService.refreshFreeCoins();

      switch (StateService.state.currentState) {
        case STATES.IDLE:
          idleInsertCoin(coin);
          break;
        case STATES.MONEY:
          insertCoin(coin);
          break;
        case STATES.DISABLED:
          disabledInstertCoin(coin);
          break;
      }
    };
}]);
