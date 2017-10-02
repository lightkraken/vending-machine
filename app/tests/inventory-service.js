'use strict';

describe('vendingApp', function() {

  beforeEach(module('vendingApp'));

  describe('InventoryService', function(){
    var InventoryService;
    var COINS;

    beforeEach(inject(function (_InventoryService_, _COINS_) {
      InventoryService = _InventoryService_;
      COINS = _COINS_;
    }));

    describe('stocking inventory', function(){
      it('should stock the inventory with a random amount of items', function(){
        expect(InventoryService.inventory.candy.red).toEqual([]);
        expect(InventoryService.inventory.candy.blue).toEqual([]);
        expect(InventoryService.inventory.candy.green).toEqual([]);
        expect(InventoryService.inventory.soda.red).toEqual([]);
        expect(InventoryService.inventory.soda.blue).toEqual([]);
        expect(InventoryService.inventory.soda.green).toEqual([]);
        expect(InventoryService.inventory.chips.red).toEqual([]);
        expect(InventoryService.inventory.chips.blue).toEqual([]);
        expect(InventoryService.inventory.chips.green).toEqual([]);
        InventoryService.stockRandomInventory();
        var min = 0;
        var max = 5;
        expect((InventoryService.inventory.candy.red.length >= min) &&
               (InventoryService.inventory.candy.red.length <= max)).toBe(true);
        expect((InventoryService.inventory.candy.blue.length >= min) &&
               (InventoryService.inventory.candy.blue.length <= max)).toBe(true);
        expect((InventoryService.inventory.candy.green.length >= min) &&
               (InventoryService.inventory.candy.green.length <= max)).toBe(true);
        expect((InventoryService.inventory.soda.red.length >= min) &&
               (InventoryService.inventory.soda.red.length <= max)).toBe(true);
        expect((InventoryService.inventory.soda.blue.length >= min) &&
               (InventoryService.inventory.soda.blue.length <= max)).toBe(true);
        expect((InventoryService.inventory.soda.green.length >= min) &&
               (InventoryService.inventory.soda.green.length <= max)).toBe(true);
        expect((InventoryService.inventory.chips.red.length >= min) &&
               (InventoryService.inventory.chips.red.length <= max)).toBe(true);
        expect((InventoryService.inventory.chips.blue.length >= min) &&
               (InventoryService.inventory.chips.blue.length <= max)).toBe(true);
        expect((InventoryService.inventory.chips.green.length >= min) &&
               (InventoryService.inventory.chips.green.length <= max)).toBe(true);                                         
      });
    });

  });
});
