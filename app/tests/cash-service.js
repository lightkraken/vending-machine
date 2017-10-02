'use strict';

describe('vendingApp', function() {

  beforeEach(module('vendingApp'));

  describe('CashService', function(){
    var CashService;
    var COINS;

    beforeEach(inject(function (_CashService_, _COINS_) {
      CashService = _CashService_;
      COINS = _COINS_;
    }));

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

    describe('refunding coins', function(){
      it('should return the coins that have been inserted', function(){
        CashService.insertCoin(COINS.NICKEL.label, COINS.NICKEL);
        CashService.insertCoin(COINS.DIME.label, COINS.DIME);
        CashService.insertCoin(COINS.QUARTER.label, COINS.QUARTER);
        expect(CashService.getTotalCredit()).toEqual(40);
        var result = CashService.refund();
        expect(result).toEqual([COINS.NICKEL, COINS.DIME, COINS.QUARTER]);
        expect(CashService.getTotalCredit()).toEqual(0);
      });
    });

  });
});
