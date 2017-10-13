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
        if(CashService.getTotalCredit() < PRICES[row]) {
          MessageService.notifyPrice(PRICES[row]);
        } else {
          var change = CashService.pay(PRICES[row]);
          if (change) {
            OutputService.returnItems(change);
          }
          dispenseItem(row,column);
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
    //  DISPENSING
    //------------------------------------\\

    var dispenseItem = function(row, column){
      StateService.setDisabled();
      $scope.dispensing[row][column][0] = true;
      $scope.hasInsertedCash = false;
      MessageService.notifyThankYou().then(function(){
        $scope.dispensing[row][column][0] = false;
        OutputService.dispenseItem(InventoryService.retrieveItem(row, column));
        StateService.setIdle();
      });
    };

    $scope.dispensing =  [
          [ [false],[false],[false] ],
          [ [false],[false],[false] ],
          [ [false],[false],[false] ]
    ];

    //------------------------------------\\
    //  DISPENSING ANIMATION
    //------------------------------------\\

    $scope.showDispensedItem = function($event){
      if (!$scope.dispensedItems.length) {
        return;
      }
      //get item from dispenser
      var item = $scope.dispensedItems.shift();
      var flyingItem = $('<div class="flying-item flying-item--' + item.type +
       ' flying-item--' + item.type + '--' + item.color + '"></div>')
        .appendTo($event.target);
      var itemX = $event.offsetX - flyingItem.width()/2;
      var itemY = $event.offsetY - flyingItem.height()/2;
      flyingItem.css({left: itemX, top: itemY});
      //calcuate flight path
      var distanceY = flyingItem.offset().top + 200;
      var distanceX = _.random(-$(window).width(), $(window).width());
      //fly the item!
      flyingItem.animate({top: 1-distanceY, left: distanceX}, 1500, 'linear', function(){
        flyingItem.remove();
      });
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
    $scope.freeNickels = [];
    $scope.freeDimes = [];
    $scope.freeQuarters = [];

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

    //------------------------------------\\
    //  RETURNING COINS ANIMATION
    //------------------------------------\\

    $scope.showReturnedItem = function($event){
      if (!$scope.returnedItems.length) {
        return;
      }
      //grab a random coin from the coin return
      var coin = $scope.returnedItems.splice(_.random($scope.returnedItems.length-1), 1)[0];
      var coinType = CoinValidatorService.validateCoin(coin);
      var flyingCoin = $('<div class="flying-coin flying-coin--' + coinType + '"></div>')
        .appendTo($event.target);
      var coinX = $event.offsetX - flyingCoin.width()/2;
      var coinY = $event.offsetY - flyingCoin.height()/2;
      flyingCoin.css({left: coinX, top: coinY});
      //calculate flight path
      var coinXoffset = flyingCoin.offset().left - coinX;
      var coinYoffset = flyingCoin.offset().top - coinY;
      var stack = $('.coinstack--' + coinType);
      var stackXoffset = stack.offset().left;
      var stackYoffset = stack.offset().top;
      var stackXrelative = stackXoffset - coinXoffset;
      var stackYrelative = stackYoffset - coinYoffset;
      //fly the coin!
      flyingCoin.animate({left: stackXrelative, top: stackYrelative}, 400, 'easeInQuart', function(){
        flyingCoin.fadeOut(300, function(){
          flyingCoin.remove();
        });
      });

    };

  }
]);
