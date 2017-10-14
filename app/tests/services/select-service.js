'use strict';

describe('vendingApp', function() {

  beforeEach(module('vendingApp'));

  describe('SelectService', function(){
    var SoundService;
    var SelectService;
    var StateService;
    var InventoryService;
    var MessageService;
    var CashService;
    var OutputService;
    var MESSAGES;
    var COINS;

    beforeEach(function() {
      module(function($provide) {
        SoundService = {
          numpad: {play: jasmine.createSpy('numpadSpy')},
        };
        $provide.value('SoundService', SoundService);
      });
    });

    beforeEach(inject(function (_SelectService_, _StateService_, _InventoryService_,
                                _MessageService_, _CashService_, _OutputService_,
                                _MESSAGES_, _COINS_) {
      SelectService = _SelectService_;
      StateService = _StateService_;
      InventoryService = _InventoryService_;
      MessageService = _MessageService_;
      CashService = _CashService_;
      OutputService = _OutputService_;
      MESSAGES = _MESSAGES_;
      COINS = _COINS_;
    }));

    beforeEach(function(){
      InventoryService.stockRandomInventory();
      StateService.setIdle();
    });

    describe('on idle state', function(){

      describe('selecting an item', function(){

        it('should play a sound effect', function(){
          SelectService.chooseItem(0,0);
          expect(SoundService.numpad.play).toHaveBeenCalled();
        });

        describe('in stock', function(){

          it('should display the price', function(){
            spyOn(MessageService, 'notifyPrice');
            SelectService.chooseItem(0,0);
            expect(MessageService.notifyPrice).toHaveBeenCalled();
          });

        });

        describe('out of stock', function(){

          it('should display sold out', function(){
            _.times(3, function(){
              InventoryService.retrieveItem(0,0);
            });
            SelectService.chooseItem(0,0);
            expect(MessageService.message.text).toEqual(MESSAGES.SOLDOUT);
          });

        });

      });

    });

    describe('on money state', function(){

      beforeEach(function(){
        StateService.setMoney();
        _.times(3, function(){
          CashService.insertCoin(COINS.QUARTER.label, COINS.QUARTER);
        });
      });

      describe('selecting an item', function(){

        describe('in stock', function(){

          describe('with enough money', function(){

            beforeEach(function(){
              spyOn(OutputService, 'returnItems');
              spyOn(OutputService, 'dispenseItem');
            });

            it('should provide change', function(){
              SelectService.chooseItem(0,0);
              expect(OutputService.returnItems).toHaveBeenCalled();
            });

            it('should dispense the item', function(){
              SelectService.chooseItem(0,0);
              expect(OutputService.dispenseItem).toHaveBeenCalled();
            });

          });

          describe('without enough money', function(){

            it('should display the price', function(){
              spyOn(MessageService, 'notifyPrice');
              SelectService.chooseItem(2,0);
              expect(MessageService.notifyPrice).toHaveBeenCalled();
            });

          });

        });

        describe('out of stock', function(){

          it('should display sold out', function(){
            _.times(3, function(){
              InventoryService.retrieveItem(0,0);
            });
            SelectService.chooseItem(0,0);
            expect(MessageService.message.text).toEqual(MESSAGES.SOLDOUT);
          });

        });

      });

    });

  });

});
