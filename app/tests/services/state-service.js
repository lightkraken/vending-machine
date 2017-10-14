'use strict';

describe('vendingApp', function() {

  beforeEach(module('vendingApp'));

  var MessageService;
  var InventoryService;
  var CashService;
  var StateService;
  var STATES;
  var MESSAGES;
  var COINS;

  beforeEach(inject(function (_StateService_, _MessageService_, _InventoryService_, _CashService_, _STATES_, _MESSAGES_, _COINS_) {
    StateService = _StateService_;
    MessageService = _MessageService_;
    InventoryService = _InventoryService_;
    CashService = _CashService_;
    STATES = _STATES_;
    MESSAGES = _MESSAGES_;
    COINS = _COINS_;
  }));

  describe('StateService', function(){

    describe('on idle state', function(){

      beforeEach(function(){
        StateService.setIdle();
      });

      describe('with no stock at all', function(){

        it('should blank the display', function(){
          expect(MessageService.message.text).toEqual('');
        });

        it('should disable the machine', function(){
          expect(StateService.state.currentState).toEqual(STATES.DISABLED);
        });

      });

      describe('without nickels', function(){

        it('should display EXACT CHANGE ONLY', function(){
          spyOn(InventoryService, 'getRowTotal').and.returnValue(true);
          spyOn(CashService, 'getCoinTotal').and.callFake(function(coin){
            if (coin === COINS.NICKEL.label) {
              return 0;
            } else {
              return _.random(1,10);
            }
          });
          StateService.setIdle();
          expect(MessageService.message.text).toEqual(MESSAGES.EXACTCHANGE);
        });

      });

      describe('with candy', function(){

        beforeEach(function(){
          spyOn(InventoryService, 'getRowTotal').and.returnValue(true);
        });

        describe('and 2 or more nickels', function(){

          it('should display INSERT COIN', function(){
            spyOn(CashService, 'getCoinTotal').and.callFake(function(coin){
              if (coin === COINS.NICKEL.label) {
                return _.random(2,10);
              }
            });
            StateService.setIdle();
            expect(MessageService.message.text).toEqual(MESSAGES.INSERTCOIN);
          });

        });

        describe('and (1 nickel) and (1 or more dimes)', function(){

          it('should display INSERT COIN', function(){
            spyOn(CashService, 'getCoinTotal').and.callFake(function(coin){
              if (coin === COINS.DIME.label) {
                return _.random(1,10);
              } else {
                return 1;
              }
            });
            StateService.setIdle();
            expect(MessageService.message.text).toEqual(MESSAGES.INSERTCOIN);
          });

        });

        describe('and (less than 2 nickels) and (no dimes)', function(){

          it('should display EXACT CHANGE ONLY', function(){
            spyOn(CashService, 'getCoinTotal').and.callFake(function(coin){
              if (coin === COINS.NICKEL.label) {
                return 1;
              } else if (coin === COINS.DIME.label) {
                return 0;
              } else {
                return _.random(1,10);
              }
            });
            StateService.setIdle();
            expect(MessageService.message.text).toEqual(MESSAGES.EXACTCHANGE);
          });

        });

      });

    });

  });

});
