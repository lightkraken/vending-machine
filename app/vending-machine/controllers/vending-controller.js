'use strict';

angular.module('vendingApp')

.controller('VendingController', ['$scope', 'COINS', 'STATES', 'PRICES', 'BROADCASTS', 'CashService',
            'InventoryService', 'CoinValidatorService', 'MessageService', 'OutputService',
            'StateService',
  function($scope, COINS, STATES, PRICES, BROADCASTS, CashService, InventoryService,
           CoinValidatorService, MessageService, OutputService, StateService) {

    $scope.inventory = InventoryService.inventory;
    $scope.returnedItems = OutputService.returnedItems;
    $scope.dispensedItems = OutputService.dispensedItems;
    $scope.message = MessageService.message;
    $scope.hasInsertedCash = false;

    $scope.$on(BROADCASTS.INVENTORY, function(){
      $scope.inventory = InventoryService.inventory;
    });
    $scope.$on(BROADCASTS.RETURNED, function(){
      $scope.returnedItems = OutputService.returnedItems;
    });
    $scope.$on(BROADCASTS.DISPENSED, function(){
      $scope.dispensedItems = OutputService.dispensedItems;
    });
    $scope.$on(BROADCASTS.MESSAGE, function(){
      $scope.message = MessageService.message;
    });

    InventoryService.stockRandomInventory();
    CashService.stockRandomCashBank();
    StateService.setIdle();

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
        $scope.hasInsertedCash = true;
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
      $scope.hasInsertedCash = false;
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
          $scope.hasInsertedCash = false;
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

    //------------------------------------\\
    //  COIN DRAG AND DROP
    //------------------------------------\\

    $scope.draggableOptions = {
      onStart: 'coinStartDrag',
      onStop: 'coinStopDrag',
      index: 0
    };

    $scope.droppableOptions = {
      onDrop: 'slotOnDrop',
      tolerance: 'intersect'
    };

    $scope.dragDropOptions = {
      revert: 'invalid'
    };

    $scope.slotContents = [];

    var refreshBank = function(){
      $scope.freeNickels = CashService.createCoins(COINS.NICKEL, 1);
      $scope.freeDimes = CashService.createCoins(COINS.DIME, 1);
      $scope.freeQuarters = CashService.createCoins(COINS.QUARTER, 1);
    };
    refreshBank();

    $scope.coinStartDrag = function(event){
      $(event.target).removeClass('coin--hidden');
    };

    $scope.coinStopDrag = function(event){
      $(event.target).addClass('coin--hidden');
    };

    $scope.slotOnDrop = function(event, ui){
      $scope.insertCoin($scope.slotContents.pop());
      refreshBank();
      $(ui.target).remove();
    };
    
  }
]);
