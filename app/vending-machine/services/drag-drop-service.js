'use strict';

angular.module('vendingApp')

.service('DragDropService', ['InputService',
  function (InputService){

    this.options = {
      draggable: {
        onStart: 'coinStartDrag',
        onStop: 'coinStopDrag',
        index: 0
      },
      droppable: {
        onDrop: 'slotOnDrop',
        tolerance: 'intersect'
      },
      dragDrop: {
        revert: 'invalid'
      }
    };

    this.coinStartDrag = function(event){
      $(event.target).removeClass('coin--hidden');
    };

    this.coinStopDrag = function(event){
      $(event.target).addClass('coin--hidden');
    };

    this.slotOnDrop = function(event, ui){
      InputService.insertCoin();
      $(ui.target).remove();
    };

}]);
