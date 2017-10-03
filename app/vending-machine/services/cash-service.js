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

    this.insertCoin = function(coinType, coin){
      switch (coinType) {
        case COINS.NICKEL.label:
          insertedCash.nickel.push(coin);
          break;
        case COINS.DIME.label:
          insertedCash.dime.push(coin);
          break;
        case COINS.QUARTER.label:
          insertedCash.quarter.push(coin);
          break;
      }
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
      var refund = [];
      refund = refund.concat(insertedCash.nickel);
      insertedCash.nickel = [];
      refund = refund.concat(insertedCash.dime);
      insertedCash.dime = [];
      refund = refund.concat(insertedCash.quarter);
      insertedCash.quarter = [];
      return refund;
    };

    var bankCredit = function(){
      cashBank.nickel = cashBank.nickel.concat(insertedCash.nickel);
      insertedCash.nickel = [];
      cashBank.dime = cashBank.dime.concat(insertedCash.dime);
      insertedCash.dime = [];
      cashBank.quarter = cashBank.quarter.concat(insertedCash.quarter);
      insertedCash.quarter = [];
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
