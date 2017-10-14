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

    it('should keep track of which inventory is currently being dispensed', function(){
      expect(InventoryService.beingDispensed).toBeDefined();
    });

    describe('stocking inventory', function(){

      beforeEach(function(){
        InventoryService.stockRandomInventory();
      });

      describe('first row', function(){

        it('should randomly stock one slot with 1 item, another slot with 2 items, and another with 3 items', function(){
          var row = [
            InventoryService.inventory[0][0].length,
            InventoryService.inventory[0][1].length,
            InventoryService.inventory[0][2].length
          ];
          var rowCount = _.countBy(row);
          expect(rowCount['1']).toEqual(1);
          expect(rowCount['2']).toEqual(1);
          expect(rowCount['3']).toEqual(1);
        });

      });

      describe('second row', function(){

        it('should randomly stock one slot with 1 item, another slot with 2 items, and another with 3 items', function(){
          var row = [
            InventoryService.inventory[1][0].length,
            InventoryService.inventory[1][1].length,
            InventoryService.inventory[1][2].length
          ];
          var rowCount = _.countBy(row);
          expect(rowCount['1']).toEqual(1);
          expect(rowCount['2']).toEqual(1);
          expect(rowCount['3']).toEqual(1);
        });

      });

      describe('third row', function(){

        it('should randomly stock one slot with 1 item, another slot with 2 items, and another with 2 items', function(){
          var row = [
            InventoryService.inventory[2][0].length,
            InventoryService.inventory[2][1].length,
            InventoryService.inventory[2][2].length
          ];
          var rowCount = _.countBy(row);
          expect(rowCount['1']).toEqual(1);
          expect(rowCount['2']).toEqual(2);
        });

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
