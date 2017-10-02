'use strict';

angular.module('vendingApp')

.controller('VendingController', ['$scope', 'COINS', 'CashService', 'InventoryService', 'CoinValidatorService',
  function($scope, COINS, CashService, InventoryService, CoinValidatorService) {
    InventoryService.stockRandomInventory();

    $scope.inventory = InventoryService.inventory;

    $scope.returnedItems = [];

    $scope.insertCoin = function(coin){
      switch (CoinValidatorService.validateCoin(coin)) {
        case COINS.NICKEL.label:
          CashService.insertCoin(COINS.NICKEL.label, coin);
          break;
        case COINS.DIME.label:
          CashService.insertCoin(COINS.DIME.label, coin);
          break;
        case COINS.DIME.label:
          CashService.insertCoin(COINS.QUARTER.label, coin);
          break;
        default:
          $scope.returnedItems.push(coin);
      }
    };

    $scope.getTotalCredit = function(){
      return CashService.getTotalCredit();
    };

    $scope.refund = function() {
      $scope.returnedItems = $scope.returnedItems.concat(CashService.refund());
    };

    // $scope.display = '';
    // $scope.cashBank = CashService.cashBank;
    //
    // var checkInventoryAmount = function(collection) {
    //   var total = 0;
    //   _.forEach(collection, function(value) {
    //     total += value.length;
    //   });
    //   return total;
    // };
    //
    // var exactChangeCheck = function(){
    //   //Check if candy is present in the machine.
    //   //Candy is $0.65 and requires one dime or two nickels of change.
    //   if ((checkInventoryAmount($scope.inventory.candy) > 0)) {
    //     if (($scope.cashBank.nickels.length < 2) && ($scope.cashBank.dimes.length < 1)) {
    //       $scope.display = 'EXACT CHANGE ONLY';
    //       return;
    //     }
    //   }
    //   //Check for the presence of other inventory.
    //   //Everything except candy requires one nickel of change.
    //   if ((checkInventoryAmount($scope.inventory.soda) > 0) ||
    //       (checkInventoryAmount($scope.inventory.chips) > 0)) {
    //     if ($scope.cashBank.nickels.length < 1) {
    //       $scope.display = 'EXACT CHANGE ONLY';
    //       return;
    //     }
    //   }
    // };
    //
    // $scope.$watch('inventory', function(){
    //   exactChangeCheck();
    // });
  }
]);
