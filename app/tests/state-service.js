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

    it('should know the current state of the application', function(){
      spyOn(InventoryService, 'getRowTotal').and.returnValue(true);
      spyOn(CashService, 'getCoinTotal').and.returnValue(5);
      StateService.setIdle();
      expect(StateService.state).toEqual(STATES.IDLE);
      StateService.setMoney();
      expect(StateService.state).toEqual(STATES.MONEY);
    });

    describe('on idle state', function(){

      beforeEach(function(){
        spyOn(MessageService, 'idle');
        spyOn(MessageService, 'idleLowCash');
        spyOn(MessageService, 'noMessage');
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
            expect(MessageService.idle).toHaveBeenCalledTimes(1);
            expect(MessageService.idleLowCash).not.toHaveBeenCalled();
          });
        });

        describe('and 1 or more dimes', function(){
          it('should display INSERT COIN', function(){
            spyOn(CashService, 'getCoinTotal').and.callFake(function(coin){
              if (coin === COINS.DIME.label) {
                return _.random(1,10);
              }
            });
            StateService.setIdle();
            expect(MessageService.idle).toHaveBeenCalledTimes(1);
            expect(MessageService.idleLowCash).not.toHaveBeenCalled();
          });
        });

        describe('and less than 2 nickels or less than 1 dime', function(){

          it('should display EXACT CHANGE ONLY', function(){
            spyOn(CashService, 'getCoinTotal').and.callFake(function(coin){
              if (coin === COINS.NICKEL.label) {
                return _.random(0,1);
              } else if (coin === COINS.DIME.label) {
                return 0;
              } else {
                return _.random(1,10);
              }
            });
            StateService.setIdle();
            expect(MessageService.idleLowCash).toHaveBeenCalled();
          });
        });

      });

      describe('with no candy', function(){

        beforeEach(function(){
          spyOn(InventoryService, 'getRowTotal').and.callFake(function(row){
            if (row !== 1) {
              return true;
            }
          });
        });

        describe('and 1 or more nickels', function(){

          it('should display INSERT COIN', function(){
            spyOn(CashService, 'getCoinTotal').and.callFake(function(coin){
              if (coin === COINS.NICKEL.label) {
                return _.random(1,10);
              }
            });
            StateService.setIdle();
            expect(MessageService.idle).toHaveBeenCalledTimes(1);
            expect(MessageService.idleLowCash).not.toHaveBeenCalled();
          });
        });

        describe('and no nickels', function(){

          it('should display EXACT CHANGE ONLY', function(){
            spyOn(CashService, 'getCoinTotal').and.callFake(function(coin){
              if (coin === COINS.NICKEL.label) {
                return 0;
              } else {
                return _.random(1,10);
              }
            });
            StateService.setIdle();
            expect(MessageService.idleLowCash).toHaveBeenCalled();
          });
        });
      });

      describe('with no stock at all', function(){

        beforeEach(function(){
          spyOn(InventoryService, 'getRowTotal').and.returnValue(0);
          StateService.setIdle();
        });

        it('should blank the display', function(){
          expect(MessageService.noMessage).toHaveBeenCalledTimes(1);
        });

        it('should disable the machine', function(){
          expect(StateService.state).toEqual(STATES.DISABLED);
        });

      });

    });

  });
});
