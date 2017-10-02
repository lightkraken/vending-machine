'use strict';

angular.module('vendingApp')

.service('InventoryService', [
  function (){

    var stockInventory = function (item, collection, amount) {
      for (var i=0; i < amount; i++) {
        collection.push(item);
      }
    };

    this.inventory = {
      soda: {
        red: [],
        blue: [],
        green: []
      },
      candy: {
        red: [],
        blue: [],
        green: []
      },
      chips: {
        red: [],
        blue: [],
        green: []
      }
    };

    this.stockRandomInventory = function(){
      stockInventory('soda', this.inventory.soda.red, _.random(5));
      stockInventory('soda', this.inventory.soda.blue, _.random(5));
      stockInventory('soda', this.inventory.soda.green, _.random(5));
      stockInventory('candy', this.inventory.candy.red, _.random(5));
      stockInventory('candy', this.inventory.candy.blue, _.random(5));
      stockInventory('candy', this.inventory.candy.green, _.random(5));
      stockInventory('chips', this.inventory.chips.red, _.random(5));
      stockInventory('chips', this.inventory.chips.blue, _.random(5));
      stockInventory('chips', this.inventory.chips.green, _.random(5));
    };

}]);
