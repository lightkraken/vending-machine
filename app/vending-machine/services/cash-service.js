'use strict';

angular.module('vendingApp')

.service('CashService', ['COINS',
  function (COINS){

    var self = this;

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

    this.createCoins = function(coin, amount){
      var coinArray = [];
      for (var i=0; i < amount; i++) {
        coinArray.push({
          weight: coin.weight,
          diameter: coin.diameter,
          thickness: coin.thickness
        });
      }
      return coinArray;
    };

    this.stockRandomCashBank = function(){
      var min = 1;
      var max = 20;
      addToCashBank(COINS.NICKEL.label, self.createCoins(COINS.NICKEL, _.random(min, max)));
      addToCashBank(COINS.DIME.label, self.createCoins(COINS.DIME, _.random(min, max)));
      addToCashBank(COINS.QUARTER.label, self.createCoins(COINS.QUARTER, _.random(min, max)));
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
      var changeDue = self.getTotalCredit() - price;
      var change = [];
      var largestCollection;
      var largestValue;
      bankCredit();
      while (changeDue > 0) {
        if (changeDue >= 25 && self.getCoinTotal(COINS.QUARTER.label)) {
          largestCollection = cashBank.quarter;
          largestValue = 25;
        } else if (changeDue >= 10 && self.getCoinTotal(COINS.DIME.label)) {
          largestCollection = cashBank.dime;
          largestValue = 10;
        } else if (changeDue >= 5 && self.getCoinTotal(COINS.NICKEL.label)) {
          largestCollection = cashBank.nickel;
          largestValue = 5;
        } else {
          break;
        }
        change.push(largestCollection.pop());
        changeDue -= largestValue;
      }
      if (change.length) {
        return change;
      }
    };

    this.freeCoins = {
      nickels: [],
      dimes: [],
      quarters: []
    };

    this.refreshFreeCoins = function() {
      self.freeCoins.nickels = self.createCoins(COINS.NICKEL, 1);
      self.freeCoins.dimes = self.createCoins(COINS.DIME, 1);
      self.freeCoins.quarters = self.createCoins(COINS.QUARTER, 1);
    };
        
}]);
