'use strict';

angular.module('vendingApp')

.controller('VendingController', ['$scope', 'COINS', 'STATES', 'PRICES', 'CashService',
            'InventoryService', 'CoinValidatorService', 'MessageService', 'OutputService',
            'StateService',
  function($scope, COINS, STATES, PRICES, CashService, InventoryService,
           CoinValidatorService, MessageService, OutputService, StateService) {

    InventoryService.stockRandomInventory();
    CashService.stockRandomCashBank();
    StateService.setIdle();

    $scope.inventory = InventoryService.inventory;
    $scope.returnedItems = OutputService.returnedItems;
    $scope.dispensedItems = OutputService.dispensedItems;
    $scope.message = MessageService.message;

    //------------------------------------\\
    //  USER INSERTS COINS
    //------------------------------------\\

    var insertCoin = function(coin){
      var coinResult = CoinValidatorService.validateCoin(coin);
      var totalCredit = CashService.getTotalCredit();
      if ((totalCredit >= 100 || !coinResult)) {
        OutputService.returnItems(coin);
        return false;
      } else {
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
      OutputService.returnItems(coin);
    };
    $scope.insertCoin = function(coin){
      switch (StateService.state) {
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

    //------------------------------------\\
    //  USER PRESSES REFUND
    //------------------------------------\\

    var refund = function(){
      OutputService.returnItems(CashService.refund());
      StateService.setIdle();
    };
    $scope.refund = function(){
      switch (StateService.state) {
        case STATES.IDLE:
          break;
        case STATES.MONEY:
          refund();
          break;
        case STATES.DISABLED:
          break;
      }
    };

    //------------------------------------\\
    //  USER CHOOSES ITEM
    //------------------------------------\\

    var chooseItem = function(row, column){
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
        if (CashService.getTotalCredit() >= PRICES[row]) {
          var change = CashService.pay(PRICES[row]);
          if (change) {
            OutputService.returnItems(change);
          }
          OutputService.dispenseItem(InventoryService.retrieveItem(row, column));
          StateService.setDisabled();
          MessageService.notifyThankYou().then(StateService.setIdle);
        } else {
          MessageService.notifyPrice(PRICES[row]);
        }
      }
    };
    $scope.chooseItem = function(row, column){
      switch (StateService.state) {
        case STATES.IDLE:
          idleChooseItem(row, column);
          break;
        case STATES.MONEY:
          moneyChooseItem(row, column);
          break;
        case STATES.DISABLED:
          break;
      }
    };
  }
]);
