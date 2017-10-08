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

    this.stockRandomInventory = function(){
      var max = 5;
      stockInventory(this.inventory[0][0], ITEMS.type.CHIPS, ITEMS.color.RED, _.random(max));
      stockInventory(this.inventory[0][1], ITEMS.type.CHIPS, ITEMS.color.BLUE, _.random(max));
      stockInventory(this.inventory[0][2], ITEMS.type.CHIPS, ITEMS.color.GREEN, _.random(max));
      stockInventory(this.inventory[1][0], ITEMS.type.CANDY, ITEMS.color.RED, _.random(max));
      stockInventory(this.inventory[1][1], ITEMS.type.CANDY, ITEMS.color.BLUE, _.random(max));
      stockInventory(this.inventory[1][2], ITEMS.type.CANDY, ITEMS.color.GREEN, _.random(max));
      stockInventory(this.inventory[2][0], ITEMS.type.SODA, ITEMS.color.RED, _.random(max));
      stockInventory(this.inventory[2][1], ITEMS.type.SODA, ITEMS.color.BLUE, _.random(max));
      stockInventory(this.inventory[2][2], ITEMS.type.SODA, ITEMS.color.GREEN, _.random(max));
    };

    this.inStock = function(row, column){
      if(this.inventory[row][column].length) {
        return true;
      } else {
        return false;
      }
    };

    this.retrieveItem = function(row, column){
      return this.inventory[row][column].pop();
    };

    this.getRowTotal = function(row) {
      var total = 0;
      _.forEach(this.inventory[row], function(column) {
        total += column.length;
      });
      return total;
    };

}]);
