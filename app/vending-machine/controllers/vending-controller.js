'use strict';

angular.module('vendingApp')

.controller('VendingController', ['$scope', 'CashService', 'InventoryService',
            'MessageService', 'OutputService', 'StateService', 'InputService',
            'DragDropService', 'SelectService',
  function($scope, CashService, InventoryService,
           MessageService, OutputService, StateService, InputService,
           DragDropService, SelectService) {

    //variables
    $scope.inventory = InventoryService.inventory;
    $scope.returnedItems = OutputService.returnedItems;
    $scope.dispensedItems = OutputService.dispensedItems;
    $scope.message = MessageService.message;
    $scope.state = StateService.state;
    $scope.beingDispensed = InventoryService.beingDispensed;
    $scope.freeCoins = CashService.freeCoins;
    $scope.slotContents = InputService.slotContents;
    $scope.dragDropOptions = DragDropService.options;
    $scope.totalItems = 0;

    //setup
    InventoryService.stockRandomInventory();
    CashService.stockRandomCashBank();
    CashService.refreshFreeCoins();
    StateService.setIdle();

    //methods
    $scope.refund = OutputService.refund;
    $scope.chooseItem = SelectService.chooseItem;
    $scope.showDispensedItem = OutputService.showDispensedItem;
    $scope.showReturnedItem = OutputService.showReturnedItem;
    $scope.coinStartDrag = DragDropService.coinStartDrag;
    $scope.coinStopDrag = DragDropService.coinStopDrag;
    $scope.slotOnDrop = DragDropService.slotOnDrop;

  }
]);
