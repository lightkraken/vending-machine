'use strict';

angular.module('vendingApp')

.controller('VendingController', ['$scope',
  function($scope) {

    $scope.returnedItems = [];
    $scope.display = '';

    $scope.inventory = {
      soda: {
        red: [],
        blue: [],
        green: []
      },
      candy: {
        red: [],
        blue: [],
        green: []
      },
      chips: {
        red: [],
        blue: [],
        green: []
      }
    };

    $scope.cash = {
      nickels: [],
      dimes: [],
      quarters: []
    };

    var cashTypes = {
      nickel: {
        weight: 5000, //mg
        diameter: 21210, //μm
        thickness: 1950 //μm
      },
      dime: {
        weight: 2268, //mg
        diameter: 17910, //μm
        thickness: 1350 //μm
      },
      quarter: {
        weight: 5670, //mg
        diameter: 24260, //μm
        thickness: 1750 //μm
      }
    };

    var measureCoin = function(candidateCoin, idealCoin){
      if ((candidateCoin.weight === idealCoin.weight) &&
          (candidateCoin.diameter === idealCoin.diameter) &&
          (candidateCoin.thickness === idealCoin.thickness)) {
        return true;
      }
    };

    $scope.inputCash = function(coin){
      if (measureCoin(coin, cashTypes.nickel)) {
        $scope.cash.nickels.push(coin);
      } else if (measureCoin(coin, cashTypes.dime)) {
        $scope.cash.dimes.push(coin);
      } else if (measureCoin(coin, cashTypes.quarter)) {
        $scope.cash.quarters.push(coin);
      } else {
        $scope.returnedItems.push(coin);
      }
    };

    var checkInventoryAmount = function(collection) {
      var total = 0;
      _.forEach(collection, function(value) {
        total += value.length;
      });
      return total;
    };

    var exactChangeChecker = function(){
      //Check if candy is present in the machine.
      //Candy is $0.65 and requires one dime or two nickels of change.
      if ((checkInventoryAmount($scope.inventory.candy) > 0)) {
        if (($scope.cash.nickels.length < 2) && ($scope.cash.dimes.length < 1)) {
          $scope.display = 'EXACT CHANGE ONLY';
          return;
        }
      }
      //Check for the presence of other inventory.
      //Everything except candy requires one nickel of change.
      if ((checkInventoryAmount($scope.inventory.soda) > 0) ||
          (checkInventoryAmount($scope.inventory.chips) > 0)) {
        if ($scope.cash.nickels.length < 1) {
          $scope.display = 'EXACT CHANGE ONLY';
          return;
        }
      }
    };

    $scope.$watch('cash', function () {
      exactChangeChecker();
    }, true);
    $scope.$watch('inventory', function () {
      exactChangeChecker();
    }, true);

  }
]);
