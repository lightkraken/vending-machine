'use strict';

angular.module('vendingApp')

.service('CoinValidatorService', ['COINS',
  function (COINS){
    this.validateCoin = function(coin) {
      if ((coin.weight === COINS.NICKEL.weight) &&
          (coin.diameter === COINS.NICKEL.diameter) &&
          (coin.thickness === COINS.NICKEL.thickness)) {
        return COINS.NICKEL.label;
      } else if ((coin.weight === COINS.DIME.weight) &&
                 (coin.diameter === COINS.DIME.diameter) &&
                 (coin.thickness === COINS.DIME.thickness)) {
        return COINS.DIME.label;
      } else if ((coin.weight === COINS.QUARTER.weight) &&
                 (coin.diameter === COINS.QUARTER.diameter) &&
                 (coin.thickness === COINS.QUARTER.thickness)) {
        return COINS.QUARTER.label;
      } else {
        return;
      }
    };
}]);
