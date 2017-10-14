'use strict';

describe('vendingApp', function() {

  beforeEach(module('vendingApp'));

  describe('OutputService', function(){
    var OutputService;
    var CashService;
    var StateService;
    var CoinValidatorService;
    var COINS;
    var STATES;
    var MESSAGES;
    var SoundService;
    var InputService;
    var InventoryService;
    var MessageService;
    var $timeout;

    beforeEach(function() {
      module(function($provide) {
        SoundService = {
          vend: {play: jasmine.createSpy('playSpy')},
          returnMultipleCoins: {play: jasmine.createSpy('multipleSpy')},
          returnSingleCoin: {play: jasmine.createSpy('singleSpy')},
          item: {play: jasmine.createSpy('itemSpy')},
          returnCoinToStack: {play: jasmine.createSpy('stackSpy')},
          insertValidCoin: {play: jasmine.createSpy('validSpy')}
        };
        $provide.value('SoundService', SoundService);
      });
    });

    beforeEach(inject(function (_$timeout_, _OutputService_, _CashService_, _StateService_,
                      _CoinValidatorService_, _InputService_, _InventoryService_, _COINS_,
                      _STATES_, _MESSAGES_, _MessageService_) {
      $timeout = _$timeout_;
      OutputService = _OutputService_;
      CashService = _CashService_;
      CoinValidatorService = _CoinValidatorService_;
      InputService = _InputService_;
      StateService = _StateService_;
      COINS = _COINS_;
      STATES = _STATES_;
      MESSAGES = _MESSAGES_;
      MessageService = _MessageService_;
      InventoryService = _InventoryService_;
      InventoryService.stockRandomInventory();
    }));

    describe('refunding coins', function(){

      describe('on money state', function(){

        beforeEach(function(){
          StateService.setIdle();
          InputService.slotContents.push(COINS.NICKEL);
          InputService.insertCoin();
        });

        it('should return the inserted money', function(){
          OutputService.refund();
          expect(CoinValidatorService.validateCoin(OutputService.returnedItems[0]))
            .toEqual(COINS.NICKEL.label);
        });

        it('should return the machine to the idle state', function(){
          expect(StateService.state.currentState).toEqual(STATES.MONEY);
          OutputService.refund();
          expect(StateService.state.currentState).toEqual(STATES.IDLE);
        });

      });

    });

    describe('returning items', function(){

      it('should return items to the coin return', function(){
        var item = [COINS.NICKEL];
        var otherItems = [
          COINS.DIME,
          COINS.QUARTER
        ];
        expect(OutputService.returnedItems).toEqual([]);
        OutputService.returnItems(item);
        expect(OutputService.returnedItems).toEqual(item);
        OutputService.returnItems(otherItems);
        expect(OutputService.returnedItems).toEqual([
          item[0],
          otherItems[0],
          otherItems[1]
        ]);
      });

      describe('when returning a single coin', function(){

        it('should play a sound effect', function(){
          var item = [COINS.NICKEL];
          OutputService.returnItems(item);
          expect(SoundService.returnSingleCoin.play).toHaveBeenCalled();
        });

      });

      describe('when returning multiple coins', function(){

        it('should play a sound effect', function(){
          var items = [
            COINS.DIME,
            COINS.QUARTER
          ];
          OutputService.returnItems(items);
          expect(SoundService.returnMultipleCoins.play).toHaveBeenCalled();
        });

      });

    });

    describe('dispensing items', function(){

      beforeEach(function(){
        StateService.setIdle();
        InputService.slotContents.push(COINS.QUARTER);
        InputService.insertCoin();
        InputService.slotContents.push(COINS.QUARTER);
        InputService.insertCoin();
      });

      it('should temporarily disable the machine until dispensing is finished', function(){
        OutputService.dispenseItem(0,0);
        expect(StateService.state.currentState).toEqual(STATES.DISABLED);
        $timeout.flush();
        expect(StateService.state.currentState).toEqual(STATES.IDLE);
      });

      it('should cause the item to animate', function(){
        expect(InventoryService.beingDispensed[0][0][0]).toBe(false);
        OutputService.dispenseItem(0,0);
        expect(InventoryService.beingDispensed[0][0][0]).toBe(true);
        $timeout.flush();
        expect(InventoryService.beingDispensed[0][0][0]).toBe(false);
      });

      it('should play a sound effect', function(){
        OutputService.dispenseItem(0,0);
        expect(SoundService.vend.play).toHaveBeenCalled();
      });

      it('should display THANK YOU for a moment', function(){
        OutputService.dispenseItem(0,0);
        expect(MessageService.message.text).toEqual(MESSAGES.THANKYOU);
        $timeout.flush();
        expect(MessageService.message.text === MESSAGES.INSERTCOIN ||
          MessageService.message.text === MESSAGES.EXACTCHANGE).toBe(true);
      });

      it('should dispense items', function(){
        OutputService.dispenseItem(0,0);
        expect(OutputService.dispensedItems.length).toEqual(0);
        $timeout.flush();
        expect(OutputService.dispensedItems.length).toEqual(1);
      });

    });

    describe('showing and animating', function(){
      var mockEvent = {
        target: '<div></div>',
        offsetX: 100,
        offsety: 100
      };

      beforeEach(function(){
        spyOn($.fn, 'offset').and.returnValue({left: 200, top: 200});
        spyOn($.fn, 'animate').and.callFake(function(obj, time, ease, callback){
          callback();
        });
        spyOn($.fn, 'remove');
      });

      describe('showing returned coins', function(){

        beforeEach(function(){
          var items = [COINS.NICKEL, COINS.DIME, COINS.QUARTER];
          OutputService.returnItems(items);
          spyOn($.fn, 'fadeOut').and.callFake(function(time, callback){
            callback();
          });
        });

        it('should retrieve a coin from the coin tray', function(){
          expect(OutputService.returnedItems.length).toEqual(3);
          OutputService.showReturnedItem(mockEvent);
          expect(OutputService.returnedItems.length).toEqual(2);
        });

        it('should animate the coin', function(){
          OutputService.showReturnedItem(mockEvent);
          expect($.fn.animate).toHaveBeenCalled();
          expect($.fn.fadeOut).toHaveBeenCalled();
          expect($.fn.remove).toHaveBeenCalled();
        });

        it('should play a sound effect', function(){
          OutputService.showReturnedItem(mockEvent);
          expect(SoundService.returnCoinToStack.play).toHaveBeenCalled();
        });

      });

      describe('showing dispensed items', function(){

        beforeEach(function(){
          StateService.setIdle();
          InputService.slotContents.push(COINS.QUARTER);
          InputService.insertCoin();
          InputService.slotContents.push(COINS.QUARTER);
          InputService.insertCoin();
          OutputService.dispenseItem(0,0);
          $timeout.flush();
        });

        it('should retrieve an item from the dispenser', function(){
          expect(OutputService.dispensedItems.length).toEqual(1);
          OutputService.showDispensedItem(mockEvent);
          expect(OutputService.dispensedItems.length).toEqual(0);
        });

        it('should animate the item', function(){
          OutputService.showDispensedItem(mockEvent);
          expect($.fn.animate).toHaveBeenCalled();
          expect($.fn.remove).toHaveBeenCalled();
        });

        it('should play a sound effect', function(){
          OutputService.showDispensedItem(mockEvent);
          expect(SoundService.item.play).toHaveBeenCalled();
        });

      });

    });

  });

});
