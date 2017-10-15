'use strict';

angular.module('vendingApp')

.service('InventoryService', ['ITEMS',
  function (ITEMS){

    var createItem = function(type, color){
      return {
        type: type,
        color: color
      };
    };

    var stockInventory = function (slot, type, color, amount) {
      for (var i=0; i < amount; i++) {
        slot.push(createItem(type, color));
      }
    };

    this.inventory = [
      [ [],[],[] ],
      [ [],[],[] ],
      [ [],[],[] ]
    ];

    this.beingDispensed = [
      [ [false],[false],[false] ],
      [ [false],[false],[false] ],
      [ [false],[false],[false] ]
    ];

    this.stockRandomInventory = function(){
      var chips = _.shuffle([1,2,3]);
      var candy = _.shuffle([1,2,3]);
      var soda = _.shuffle([1,2,2]);

      stockInventory(this.inventory[0][0], ITEMS.type.CHIPS, ITEMS.color.RED, chips[0]);
      stockInventory(this.inventory[0][1], ITEMS.type.CHIPS, ITEMS.color.BLUE, chips[1]);
      stockInventory(this.inventory[0][2], ITEMS.type.CHIPS, ITEMS.color.GREEN, chips[2]);
      stockInventory(this.inventory[1][0], ITEMS.type.CANDY, ITEMS.color.RED, candy[0]);
      stockInventory(this.inventory[1][1], ITEMS.type.CANDY, ITEMS.color.BLUE, candy[1]);
      stockInventory(this.inventory[1][2], ITEMS.type.CANDY, ITEMS.color.GREEN, candy[2]);
      stockInventory(this.inventory[2][0], ITEMS.type.SODA, ITEMS.color.RED, soda[0]);
      stockInventory(this.inventory[2][1], ITEMS.type.SODA, ITEMS.color.BLUE, soda[1]);
      stockInventory(this.inventory[2][2], ITEMS.type.SODA, ITEMS.color.GREEN, soda[2]);
    };

    this.inStock = function(row, column){
      if(this.inventory[row][column].length) {
        return true;
      } else {
        return false;
      }
    };

    this.retrieveItem = function(row, column){
      var item = this.inventory[row][column].pop();
      return item;
    };

    this.getRowTotal = function(row) {
      var total = 0;
      _.forEach(this.inventory[row], function(column) {
        total += column.length;
      });
      return total;
    };

}]);
