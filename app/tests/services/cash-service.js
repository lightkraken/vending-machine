'use strict';

describe('vendingApp', function() {

  beforeEach(module('vendingApp'));

  describe('CashService', function(){
    var CashService;
    var CoinValidatorService;
    var COINS;
    var change;

    beforeEach(inject(function (_CashService_, _CoinValidatorService_, _COINS_) {
      CashService = _CashService_;
      CoinValidatorService = _CoinValidatorService_;
      COINS = _COINS_;
    }));

    describe('creating coins', function(){
      it('should create dimes', function(){
        expect(
          CoinValidatorService.validateCoin(
            CashService.createCoins(COINS.DIME, 1)[0])).toEqual(COINS.DIME.label);
      });
      it('should create nickels', function(){
        expect(
          CoinValidatorService.validateCoin(
            CashService.createCoins(COINS.NICKEL, 1)[0])).toEqual(COINS.NICKEL.label);
      });
      it('should create quarters', function(){
        expect(
          CoinValidatorService.validateCoin(
            CashService.createCoins(COINS.QUARTER, 1)[0])).toEqual(COINS.QUARTER.label);
      });
    });

    describe('stocking cash bank', function(){
      it('should stock the cash bank with a random amount of coins', function(){
        var min = 1;
        var max = 20;
        CashService.stockRandomCashBank();
        expect((CashService.getCoinTotal(COINS.NICKEL.label) >= min) &&
               (CashService.getCoinTotal(COINS.NICKEL.label) <= max)).toBe(true);
        expect((CashService.getCoinTotal(COINS.DIME.label) >= min) &&
              (CashService.getCoinTotal(COINS.DIME.label) <= max)).toBe(true);
        expect((CashService.getCoinTotal(COINS.QUARTER.label) >= min) &&
               (CashService.getCoinTotal(COINS.QUARTER.label) <= max)).toBe(true);
      });
    });

    describe('inserting coins', function(){

      it('should add 5 cents of credit when a nickel is inserted', function() {
        CashService.insertCoin(COINS.NICKEL.label, COINS.NICKEL);
        expect(CashService.getTotalCredit()).toEqual(5);
      });

      it('should add 10 cents of credit when a dime is inserted', function() {
        CashService.insertCoin(COINS.DIME.label, COINS.DIME);
        expect(CashService.getTotalCredit()).toEqual(10);
      });

      it('should add 25 cents of credit when a quarter is inserted', function() {
        CashService.insertCoin(COINS.QUARTER.label, COINS.QUARTER);
        expect(CashService.getTotalCredit()).toEqual(25);
      });

    });

    describe('getting the total credit', function(){

      it('should get the total cash value of coins that the user has inserted', function(){
        expect(CashService.getTotalCredit()).toEqual(0);
        CashService.insertCoin(COINS.NICKEL.label, COINS.NICKEL);
        CashService.insertCoin(COINS.DIME.label, COINS.DIME);
        CashService.insertCoin(COINS.QUARTER.label, COINS.QUARTER);
        CashService.insertCoin(COINS.QUARTER.label, COINS.QUARTER);
        expect(CashService.getTotalCredit()).toEqual(65);
      });

    });

    describe('refunding coins', function(){

      it('should refund the coins that have been inserted', function(){
        expect(CashService.getTotalCredit()).toEqual(0);
        CashService.insertCoin(COINS.NICKEL.label, COINS.NICKEL);
        CashService.insertCoin(COINS.DIME.label, COINS.DIME);
        CashService.insertCoin(COINS.QUARTER.label, COINS.QUARTER);
        expect(CashService.getTotalCredit()).toEqual(40);
        expect(CashService.refund()).toEqual([COINS.NICKEL, COINS.DIME, COINS.QUARTER]);
        expect(CashService.getTotalCredit()).toEqual(0);
      });

    });

    describe('completing a transaction', function(){

      it('should take the money from the customer', function(){
        CashService.insertCoin(COINS.NICKEL.label, COINS.NICKEL);
        CashService.insertCoin(COINS.DIME.label, COINS.DIME);
        CashService.insertCoin(COINS.QUARTER.label, COINS.QUARTER);
        CashService.insertCoin(COINS.QUARTER.label, COINS.QUARTER);
        expect(CashService.getTotalCredit()).toEqual(65);
        CashService.pay(10);
        expect(CashService.getTotalCredit()).toEqual(0);
        expect(CashService.getCoinTotal(COINS.NICKEL.label)).toEqual(0);
        expect(CashService.getCoinTotal(COINS.DIME.label)).toEqual(1);
        expect(CashService.getCoinTotal(COINS.QUARTER.label)).toEqual(0);
      });

      it('should efficiently make change, giving the customer back as few coins as possible', function(){
        CashService.insertCoin(COINS.NICKEL.label, COINS.NICKEL);
        CashService.insertCoin(COINS.NICKEL.label, COINS.NICKEL);
        CashService.insertCoin(COINS.DIME.label, COINS.DIME);
        CashService.insertCoin(COINS.QUARTER.label, COINS.QUARTER);
        expect(CashService.getTotalCredit()).toEqual(45);
        change = CashService.pay(35);
        expect(change).toEqual([COINS.DIME]);
      });

      it('should make change with smaller denominations when larger are not available', function(){
        CashService.insertCoin(COINS.NICKEL.label, COINS.NICKEL);
        CashService.insertCoin(COINS.NICKEL.label, COINS.NICKEL);
        CashService.insertCoin(COINS.QUARTER.label, COINS.QUARTER);
        expect(CashService.getTotalCredit()).toEqual(35);
        change = CashService.pay(25);
        expect(change).toEqual([
          COINS.NICKEL,
          COINS.NICKEL
        ]);
      });

      it('should make as much change as possible, without giving too much change, when insufficient change is available', function(){
        CashService.insertCoin(COINS.NICKEL.label, COINS.NICKEL);
        CashService.pay(5);
        CashService.insertCoin(COINS.QUARTER.label, COINS.QUARTER);
        CashService.insertCoin(COINS.QUARTER.label, COINS.QUARTER);
        CashService.insertCoin(COINS.QUARTER.label, COINS.QUARTER);
        expect(CashService.getTotalCredit()).toEqual(75);
        change = CashService.pay(65);
        expect(change).toEqual([
          COINS.NICKEL
        ]);
      });

    });

    describe('providing free coins', function(){

      it('should provide an unlimited amout of coins for the user to drag into the machine', function(){
        CashService.refreshFreeCoins();
        expect(CashService.freeCoins.nickels.length === 1);
        expect(CashService.freeCoins.dimes.length === 1);
        expect(CashService.freeCoins.quarters.length === 1);
        CashService.freeCoins.nickels.pop();
        CashService.freeCoins.dimes.pop();
        CashService.freeCoins.quarters.pop();
        CashService.refreshFreeCoins();
        expect(CashService.freeCoins.nickels.length === 1);
        expect(CashService.freeCoins.dimes.length === 1);
        expect(CashService.freeCoins.quarters.length === 1);
      });

    });

  });

});
