'use strict';

angular.module('vendingApp')

.service('OutputService', ['SoundService', 'CoinValidatorService', 'StateService',
         'InventoryService', 'MessageService', 'CashService', 'STATES',
  function (SoundService, CoinValidatorService, StateService,
            InventoryService, MessageService, CashService, STATES) {
    var self = this;
    this.returnedItems = [];
    this.dispensedItems = [];

    this.refund = function(){
      if (StateService.state.currentState === STATES.MONEY) {
        self.returnItems(CashService.refund());
        StateService.setIdle();
      }
    };

    this.returnItems = function(items) {
      _.each(items, function(item){
        self.returnedItems.push(item);
      });
      if (items.length > 1) {
        SoundService.returnMultipleCoins.play();
      } else {
        SoundService.returnSingleCoin.play();
        }
    };

    this.dispenseItem = function(row, column) {
      StateService.setDisabled();
      SoundService.vend.play();
      InventoryService.beingDispensed[row][column][0] = true;
      MessageService.notifyThankYou().then(function(){
        self.dispensedItems.unshift(InventoryService.retrieveItem(row, column));
        InventoryService.beingDispensed[row][column][0] = false;
        StateService.setIdle();
      });
    };

    this.showDispensedItem = function($event){
      if (!self.dispensedItems.length) {
        return;
      }
      //get item from dispenser
      var item = self.dispensedItems.shift();
      var flyingItem = $('<div class="flying-item flying-item--' + item.type +
       ' flying-item--' + item.type + '--' + item.color + '"></div>')
        .appendTo($event.target);
      var itemX = $event.offsetX - flyingItem.width()/2;
      var itemY = $event.offsetY - flyingItem.height()/2;
      flyingItem.css({left: itemX, top: itemY});
      //calcuate flight path
      var distanceY = flyingItem.offset().top + 200;
      var distanceX = _.random(-$(window).width(), $(window).width());
      //fly the item!
      SoundService.item.play();
      flyingItem.animate({top: 1-distanceY, left: distanceX}, 1500, 'linear', function(){
        flyingItem.remove();
      });
    };

    this.showReturnedItem = function($event){
      if (!this.returnedItems.length) {
        return;
      }
      //grab a random coin from the coin return
      var coin = this.returnedItems.splice(_.random(this.returnedItems.length-1), 1)[0];
      var coinType = CoinValidatorService.validateCoin(coin);
      var flyingCoin = $('<div class="flying-coin flying-coin--' + coinType + '"></div>')
        .appendTo($event.target);
      var coinX = $event.offsetX - flyingCoin.width()/2;
      var coinY = $event.offsetY - flyingCoin.height()/2;
      flyingCoin.css({left: coinX, top: coinY});
      //calculate flight path
      var coinXoffset = flyingCoin.offset().left - coinX;
      var coinYoffset = flyingCoin.offset().top - coinY;
      var stack = $('.coinstack--' + coinType);
      var stackXoffset = stack.offset().left;
      var stackYoffset = stack.offset().top;
      var stackXrelative = stackXoffset - coinXoffset;
      var stackYrelative = stackYoffset - coinYoffset;
      //fly the coin!
      flyingCoin.animate({left: stackXrelative, top: stackYrelative}, 400, 'easeInQuart', function(){
        SoundService.returnCoinToStack.play();
        flyingCoin.fadeOut(300, function(){
          flyingCoin.remove();
        });
      });

    };
}]);
