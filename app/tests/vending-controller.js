'use strict';

describe('app module', function() {

  beforeEach(module('vendingApp'));

  var nickel = {
    weight: 5000,
    diameter: 21210,
    thickness: 1950
  };

  var dime = {
    weight: 2268,
    diameter: 17910,
    thickness: 1350
  };

  var quarter = {
    weight: 5670,
    diameter: 24260,
    thickness: 1750
  };

  describe('vending controller', function(){
    var $scope;

    beforeEach(inject(function ($rootScope, $controller) {
        $scope = $rootScope.$new();
        $controller('VendingController', {'$scope': $scope});
    }));

    describe('inputting coins', function(){
      it('should add a nickel to cash bank when a nickel is inserted', function() {
        $scope.inputCash(nickel);
        expect($scope.cash.nickels.length).toEqual(1);
      });
      it('should add a dime to cash bank when a dime is inserted', function() {
        $scope.inputCash(dime);
        expect($scope.cash.dimes.length).toEqual(1);
      });
      it('should add a quarter to cash bank when a quarter is inserted', function() {
        $scope.inputCash(quarter);
        expect($scope.cash.quarters.length).toEqual(1);
      });
      it('should reject invalid coins', function() {
        var penny = {
          weight: 2500,
          diameter: 19000,
          thickness: 1520
        };
        $scope.inputCash(penny);
        expect($scope.returnedItems.length).toEqual(1);
      });
    });

    describe('USE EXACT CHANGE messaging', function(){
      it('should display USE EXACT CHANGE when only candy is present and less than 1 dime or 2 nickels are in cash bank', function(){
        $scope.inventory.candy.blue.push('candy');
        $scope.cash.quarters = [quarter, quarter];
        $scope.cash.dimes = [];
        $scope.cash.nickels = [nickel];
        $scope.$digest();
        expect($scope.display).toEqual('EXACT CHANGE ONLY');
      });
      it('should display USE EXACT CHANGE when candy and other items are present and (less than 1 nickel and 1 dime) or (less than 2 nickels) are in cash bank', function(){
        $scope.inventory.candy.red.push('candy');
        $scope.inventory.chips.green.push('chips');
        $scope.cash.quarters = [quarter];
        $scope.cash.dimes = [];
        $scope.cash.nickels = [nickel];
        $scope.$digest();
        expect($scope.display).toEqual('EXACT CHANGE ONLY');
        $scope.inventory.soda.blue.push('soda');
        $scope.$digest();
        expect($scope.display).toEqual('EXACT CHANGE ONLY');
        $scope.inventory.chips.green.pop();
        $scope.$digest();
        expect($scope.display).toEqual('EXACT CHANGE ONLY');
        $scope.cash.quarters = [quarter];
        $scope.cash.dimes = [dime];
        $scope.cash.nickels = [];
        $scope.$digest();
        expect($scope.display).toEqual('EXACT CHANGE ONLY');
      });
      it('should display USE EXACT CHANGE when other items, without candy, are present and less than 1 nickel is in cash bank', function(){
        $scope.inventory.chips.blue.push('chips');
        $scope.cash.quarters = [quarter, quarter];
        $scope.cash.dimes = [dime];
        $scope.cash.nickels = [];
        $scope.$digest();
        expect($scope.display).toEqual('EXACT CHANGE ONLY');
        $scope.inventory.soda.green.push('soda');
        $scope.$digest();
        expect($scope.display).toEqual('EXACT CHANGE ONLY');
      });
      it('should display nothing when only candy is present and at least 1 dime or 2 nickels are in cash bank', function(){
        $scope.inventory.candy.blue.push('candy');
        $scope.cash.quarters = [];
        $scope.cash.dimes = [dime];
        $scope.cash.nickels = [nickel];
        $scope.$digest();
        expect($scope.display).toEqual('');
        $scope.cash.quarters = [];
        $scope.cash.dimes = [];
        $scope.cash.nickels = [nickel, nickel];
        $scope.$digest();
        expect($scope.display).toEqual('');
      });
      it('should display nothing when candy and other items are present and (at least 1 nickel and 1 dime) or (at least 2 nickels) are in cash bank', function(){
        $scope.inventory.candy.red.push('candy');
        $scope.inventory.chips.green.push('chips');
        $scope.cash.quarters = [quarter];
        $scope.cash.dimes = [dime];
        $scope.cash.nickels = [nickel];
        $scope.$digest();
        expect($scope.display).toEqual('');
        $scope.inventory.soda.blue.push('soda');
        $scope.$digest();
        expect($scope.display).toEqual('');
        $scope.inventory.chips.green.pop();
        $scope.$digest();
        expect($scope.display).toEqual('');
        $scope.cash.quarters = [quarter];
        $scope.cash.dimes = [];
        $scope.cash.nickels = [nickel, nickel];
        $scope.$digest();
        expect($scope.display).toEqual('');
      });
      it('should display nothing when other items, without candy, are present and at least 1 nickel is in cash bank', function(){
        $scope.inventory.chips.green.push('chips');
        $scope.cash.quarters = [quarter];
        $scope.cash.dimes = [];
        $scope.cash.nickels = [nickel];
        $scope.$digest();
        expect($scope.display).toEqual('');
        $scope.inventory.soda.blue.push('soda');
        $scope.$digest();
        expect($scope.display).toEqual('');
        $scope.inventory.chips.green.pop();
        $scope.$digest();
        expect($scope.display).toEqual('');
      });
      it('should display nothing when inventory is empty, regardless of money in cash bank', function(){
        $scope.cash.quarters = [];
        $scope.cash.dimes = [];
        $scope.cash.nickels = [];
        $scope.$digest();
        expect($scope.display).toEqual('');
        $scope.cash.quarters = [quarter, quarter, quarter];
        $scope.cash.dimes = [dime, dime, dime];
        $scope.cash.nickels = [nickel, nickel, nickel];
        $scope.$digest();
        expect($scope.display).toEqual('');                       
      });
    });

  });
});
