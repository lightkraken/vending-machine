'use strict';

angular.module('vendingApp')

.controller('VendingController', ['$scope',
  function($scope) {

    $scope.returnedItems = [];

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
  }
]);
