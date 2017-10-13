'use strict';

describe('vendingApp', function() {

  beforeEach(module('vendingApp'));

  describe('OutputService', function(){
    var OutputService;
    var $rootScope;

    beforeEach(inject(function (_OutputService_, _$rootScope_) {
      OutputService = _OutputService_;
      $rootScope = _$rootScope_;
    }));

    describe('returning items', function(){

      it('should return items to the coin return', function(){
        var item = {thing: 'penny'};
        var otherItems = [
          {thing: 'dime'},
          {thing: 'quarter'},
          {thing: 'bottle cap'}
        ];
        expect(OutputService.returnedItems).toEqual([]);
        OutputService.returnItems(item);
        expect(OutputService.returnedItems).toEqual([item]);
        OutputService.returnItems(otherItems);
        expect(OutputService.returnedItems).toEqual([
          item,
          otherItems[0],
          otherItems[1],
          otherItems[2]
        ]);
      });

    });

    describe('dispensing items', function(){

      it('should dispense items to the customer', function(){
        var item = {thing: 'soda'};
        var otherItem = {thing: 'candy'};
        expect(OutputService.dispensedItems).toEqual([]);
        OutputService.dispenseItem(item);
        expect(OutputService.dispensedItems).toEqual([item]);
        OutputService.dispenseItem(otherItem);
        expect(OutputService.dispensedItems).toEqual([otherItem,item]);
      });

    });

  });

});
