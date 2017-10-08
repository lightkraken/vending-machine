'use strict';

describe('vendingApp', function() {

  beforeEach(module('vendingApp'));

  describe('MessageService', function(){
    var MessageService;
    var $timeout;
    var MESSAGES;

    beforeEach(inject(function (_MessageService_, _$timeout_, _MESSAGES_) {
      MessageService = _MessageService_;
      $timeout = _$timeout_;
      MESSAGES = _MESSAGES_;
    }));

    describe('idle message', function(){

      it('should display INSERT COIN', function(){
        MessageService.idle();
        expect(MessageService.message).toEqual(MESSAGES.INSERTCOIN);
      });

    });

    describe('idle with low cash message', function(){

      it('should display EXACT CHANGE ONLY', function(){
        MessageService.idleLowCash();
        expect(MessageService.message).toEqual(MESSAGES.EXACTCHANGE);
      });

    });

    describe('total credit message', function(){

      it('should display the value of coins inserted', function(){
        MessageService.totalCredit(50);
        expect(MessageService.message).toEqual('$0.50');
        MessageService.totalCredit(65);
        expect(MessageService.message).toEqual('$0.65');
        MessageService.totalCredit(100);
        expect(MessageService.message).toEqual('$1.00');
      });

    });

    describe('no message', function(){

      it('should display nothing', function(){
        MessageService.noMessage();
        expect(MessageService.message).toEqual('');
      });

    });

    describe('thank you notification', function(){

      it('should display THANK YOU, and return a promise that resolves after a moment', function(){
        var resolved = false;
        MessageService.notifyThankYou().then(function(){
          resolved = true;
        });
        expect(MessageService.message).toEqual(MESSAGES.THANKYOU);
        expect(resolved).toBe(false);
        $timeout.flush();
        expect(resolved).toBe(true);
      });

    });

    describe('sold out notification', function(){

      it('should display SOLD OUT for a moment, then return to the previous message', function(){
        MessageService.idle();
        MessageService.notifySoldOut();
        expect(MessageService.message).toEqual(MESSAGES.SOLDOUT);
        $timeout.flush();
        expect(MessageService.message).toEqual(MESSAGES.INSERTCOIN);
      });

      it('should interrupt and override any other notifications currently being displayed', function(){
        MessageService.idle();
        MessageService.notifyPrice(65);
        MessageService.notifySoldOut();
        expect(MessageService.message).toEqual(MESSAGES.SOLDOUT);
        $timeout.flush();
        expect(MessageService.message).toEqual(MESSAGES.INSERTCOIN);
      });

    });

    describe('price notification', function(){

      it('should display the PRICE for a moment, then return to the previous message', function(){
        MessageService.idle();
        MessageService.notifyPrice(65);
        expect(MessageService.message).toEqual(MESSAGES.PRICE + ' $0.65');
        $timeout.flush();
        expect(MessageService.message).toEqual(MESSAGES.INSERTCOIN);
      });

      it('should interrupt and override any other notifications currently being displayed', function(){
        MessageService.idle();
        MessageService.notifySoldOut();
        MessageService.notifyPrice(65);
        expect(MessageService.message).toEqual(MESSAGES.PRICE + ' $0.65');
        $timeout.flush();
        expect(MessageService.message).toEqual(MESSAGES.INSERTCOIN);
      });

    });

  });
  
});
