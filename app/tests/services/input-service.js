'use strict';

describe('vendingApp', function() {

  beforeEach(module('vendingApp'));

  describe('InputService', function(){
    var InputService;
    var StateService;
    var SoundService;
    var OutputService;
    var InventoryService;
    var CashService;
    var COINS;
    var STATES;
    var penny = {
      weight: 2500,
      diameter: 19050,
      thickness: 1520
    };

    beforeEach(function() {
      module(function($provide) {
        SoundService = {
          insertValidCoin: {play: jasmine.createSpy('validSpy')}
        };
        $provide.value('SoundService', SoundService);
      });
    });

    beforeEach(inject(function (_InputService_, _StateService_, _OutputService_,
                                _InventoryService_, _CashService_, _COINS_, _STATES_) {
      InputService = _InputService_;
      StateService = _StateService_;
      OutputService = _OutputService_;
      InventoryService = _InventoryService_;
      CashService = _CashService_;
      COINS = _COINS_;
      STATES = _STATES_;
    }));

    describe('inputting coins', function(){

      beforeEach(function(){
        InventoryService.stockRandomInventory();
      });

      describe('on idle state', function(){

        beforeEach(function(){
          StateService.setIdle();
        });

        describe('with a valid coin', function(){

          beforeEach(function(){
            InputService.slotContents.push(COINS.NICKEL);
            InputService.insertCoin();
          });

          it('should play a sound effect', function(){
            expect(SoundService.insertValidCoin.play).toHaveBeenCalled();
          });

          it('should add the value of the coin to the total credits', function(){
            expect(CashService.getTotalCredit()).toEqual(COINS.NICKEL.value);
          });

          it('should transition the machine to the money state', function(){
            expect(StateService.state.currentState).toEqual(STATES.MONEY);
          });

        });

        describe('wtih an invalid coin', function(){

          it('should return the coin', function(){
            spyOn(OutputService, 'returnItems');
            InputService.slotContents.push(penny);
            InputService.insertCoin();
            expect(OutputService.returnItems).toHaveBeenCalledWith([penny]);
          });

        });

      });

      describe('on money state', function(){

        beforeEach(function(){
          StateService.setMoney();
        });

        describe('with a valid coin', function(){

          beforeEach(function(){
            InputService.slotContents.push(COINS.NICKEL);
            InputService.insertCoin();
          });

          it('should play a sound effect', function(){
            expect(SoundService.insertValidCoin.play).toHaveBeenCalled();
          });

          it('should add the value of the coin to the total credits', function(){
            expect(CashService.getTotalCredit()).toEqual(COINS.NICKEL.value);
          });

        });

        describe('with an invalid coin', function(){

          it('should return the coin', function(){
            spyOn(OutputService, 'returnItems');
            InputService.slotContents.push(penny);
            InputService.insertCoin();
            expect(OutputService.returnItems).toHaveBeenCalledWith([penny]);
          });

        });

        describe('with $1.00 or more of credit', function(){

          it('should return the coin', function(){
            spyOn(OutputService, 'returnItems');
            _.times(5, function(){
              InputService.slotContents.push(COINS.QUARTER);
              InputService.insertCoin();
            });
            expect(OutputService.returnItems).toHaveBeenCalledWith([COINS.QUARTER]);
          });

        });

      });

      describe('on disabled state', function(){

        it('should return the coin', function(){
          spyOn(OutputService, 'returnItems');
          StateService.setDisabled();
          InputService.slotContents.push(COINS.NICKEL);
          InputService.insertCoin();
          expect(OutputService.returnItems).toHaveBeenCalledWith([COINS.NICKEL]);
        });

      });

    });

  });

});
