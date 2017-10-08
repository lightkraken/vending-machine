'use strict';

describe('vendingApp', function() {

  beforeEach(module('vendingApp'));

  describe('CoinValidatorService', function(){
    var CoinValidatorService;
    var COINS;

    beforeEach(inject(function (_CoinValidatorService_, _COINS_) {
      CoinValidatorService = _CoinValidatorService_;
      COINS = _COINS_;
    }));

    describe('validating coins', function(){

      it('should identify valid coins', function(){
        expect(CoinValidatorService.validateCoin(COINS.NICKEL)).toEqual(COINS.NICKEL.label);
        expect(CoinValidatorService.validateCoin(COINS.DIME)).toEqual(COINS.DIME.label);
        expect(CoinValidatorService.validateCoin(COINS.QUARTER)).toEqual(COINS.QUARTER.label);
      });

      it('should reject invalid coins', function(){
        var penny = {
          weight: 2500,
          diameter: 19000,
          thickness: 1520
        };
        expect(CoinValidatorService.validateCoin(penny)).toBeUndefined();
      });

    });

  });
  
});
