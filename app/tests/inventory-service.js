'use strict';

describe('vendingApp', function() {

  beforeEach(module('vendingApp'));

  describe('InventoryService', function(){
    var InventoryService;
    var COINS;
    var ITEMS;

    beforeEach(inject(function (_InventoryService_, _COINS_, _ITEMS_) {
      InventoryService = _InventoryService_;
      COINS = _COINS_;
      ITEMS = _ITEMS_;
    }));

    describe('stocking inventory', function(){
      it('should stock the inventory with a random amount of items', function(){
        var min = 0;
        var max = 5;
        InventoryService.stockRandomInventory();
        expect((InventoryService.inventory[0][0].length >= min) &&
               (InventoryService.inventory[0][0].length <= max)).toBe(true);
        expect((InventoryService.inventory[0][1].length >= min) &&
               (InventoryService.inventory[0][1].length <= max)).toBe(true);
        expect((InventoryService.inventory[0][2].length >= min) &&
               (InventoryService.inventory[0][2].length <= max)).toBe(true);
        expect((InventoryService.inventory[1][0].length >= min) &&
               (InventoryService.inventory[1][0].length <= max)).toBe(true);
        expect((InventoryService.inventory[1][1].length >= min) &&
               (InventoryService.inventory[1][1].length <= max)).toBe(true);
        expect((InventoryService.inventory[1][2].length >= min) &&
               (InventoryService.inventory[1][2].length <= max)).toBe(true);
        expect((InventoryService.inventory[2][0].length >= min) &&
               (InventoryService.inventory[2][0].length <= max)).toBe(true);
        expect((InventoryService.inventory[2][1].length >= min) &&
               (InventoryService.inventory[2][1].length <= max)).toBe(true);
        expect((InventoryService.inventory[2][2].length >= min) &&
               (InventoryService.inventory[2][2].length <= max)).toBe(true);
      });
    });

    describe('checking stock', function(){
      it('should check if an item is in stock or sold-out', function(){
        var randomRow = _.random(2);
        var randomColumn = _.random(2);
        InventoryService.inventory[randomRow][randomColumn].push(ITEMS.type.CANDY);
        expect(InventoryService.inStock(randomRow, randomColumn)).toBe(true);
        InventoryService.retrieveItem(randomRow,randomColumn);
        expect(InventoryService.inStock(randomRow, randomColumn)).toBe(false);
      });

      it('should count the number of items in one row', function(){
        InventoryService.inventory[1][0].push(ITEMS.type.CANDY);
        InventoryService.inventory[1][0].push(ITEMS.type.CANDY);
        InventoryService.inventory[1][1].push(ITEMS.type.CANDY);
        InventoryService.inventory[1][2].push(ITEMS.type.CANDY);
        InventoryService.inventory[1][2].push(ITEMS.type.CANDY);
        expect(InventoryService.getRowTotal(1)).toEqual(5);
      });
    });

    describe('retrieving item', function(){
      it('should retrieve an item from stock', function(){
        var randomRow = _.random(2);
        var randomColumn = _.random(2);
        InventoryService.inventory[randomRow][randomColumn].push(ITEMS.type.CANDY);
        expect(InventoryService.retrieveItem(randomRow,randomColumn)).toEqual(ITEMS.type.CANDY);
      });
    });

  });
});
