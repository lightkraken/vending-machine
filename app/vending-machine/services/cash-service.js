'use strict';

angular.module('vendingApp')

.service('CashService', ['COINS',
  function (COINS){
    var insertedCash = {
      nickel: [],
      dime: [],
      quarter: []
    };

    var cashBank = {
      nickel: [],
      dime: [],
      quarter: []
    };

    var addToCashBank = function(coinType, coinArray){
      cashBank[coinType] = cashBank[coinType].concat(coinArray);
    };

    var clearInsertedCash = function(){
      _.each(insertedCash, function(value, key){
        insertedCash[key] = [];
      });
    };

    var bankCredit = function(){
      addToCashBank(COINS.NICKEL.label, insertedCash.nickel);
      addToCashBank(COINS.DIME.label, insertedCash.dime);
      addToCashBank(COINS.QUARTER.label, insertedCash.quarter);
      clearInsertedCash();
    };

    this.insertCoin = function(coinType, coin){
      insertedCash[coinType].push(coin);
    };

    this.getTotalCredit = function(){
      var total = 0;
      _.each(insertedCash.nickel, function(){
        total += COINS.NICKEL.value;
      });
      _.each(insertedCash.dime, function(){
        total += COINS.DIME.value;
      });
      _.each(insertedCash.quarter, function(){
        total += COINS.QUARTER.value;
      });
      return total;
    };

    this.getCoinTotal = function(coinType) {
      return cashBank[coinType].length;
    };

    this.refund = function(){
      var refund = _.reduce(insertedCash, function(result, value) {
        return result.concat(value);
      });
      clearInsertedCash();
      return refund;
    };

    this.pay = function(price) {
      var changeDue = this.getTotalCredit() - price;
      var change = [];
      var largestCollection;
      var largestValue;
      bankCredit();
      while (changeDue > 0) {
        if (changeDue >= 25 && this.getCoinTotal(COINS.QUARTER.label)) {
          largestCollection = cashBank.quarter;
          largestValue = 25;
        } else if (changeDue >= 10 && this.getCoinTotal(COINS.DIME.label)) {
          largestCollection = cashBank.dime;
          largestValue = 10;
        } else if (changeDue >= 5 && this.getCoinTotal(COINS.NICKEL.label)) {
          largestCollection = cashBank.nickel;
          largestValue = 5;
        }
        change.push(largestCollection.pop());
        changeDue -= largestValue;
      }
      return change;
    };
}]);
