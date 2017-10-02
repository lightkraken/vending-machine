'use strict';

angular.module('vendingApp')

.service('CashService', ['COINS',
  function (COINS){
    var cashBank = {
      nickels: [],
      dimes: [],
      quarters: []
    };

    var insertedCash = {
      nickels: [],
      dimes: [],
      quarters: []
    };

    this.insertCoin = function(coinType, coin){
      switch (coinType) {
        case COINS.NICKEL.label:
          insertedCash.nickels.push(coin);
          break;
        case COINS.DIME.label:
          insertedCash.dimes.push(coin);
          break;
        case COINS.QUARTER.label:
          insertedCash.quarters.push(coin);
          break;
      }
    };

    this.getTotalCredit = function(){
      var total = 0;
      _.each(insertedCash.nickels, function(){
        total += COINS.NICKEL.value;
      });
      _.each(insertedCash.dimes, function(){
        total += COINS.DIME.value;
      });
      _.each(insertedCash.quarters, function(){
        total += COINS.QUARTER.value;
      });
      return total;
    };

    this.refund = function(){
      var refund = [];
      _.each(insertedCash.nickels, function(coin){
        refund.push(coin);
      });
      _.each(insertedCash.dimes, function(coin){
        refund.push(coin);
      });
      _.each(insertedCash.quarters, function(coin){
        refund.push(coin);
      });
      insertedCash.nickels = [];
      insertedCash.dimes = [];
      insertedCash.quarters = [];
      return refund;
    };
}]);
