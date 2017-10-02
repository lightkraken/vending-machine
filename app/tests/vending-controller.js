'use strict';

xdescribe('app module', function() {

  beforeEach(module('vendingApp'));

  describe('vending controller', function(){
    var $scope;

    beforeEach(inject(function ($rootScope, $controller) {
        $scope = $rootScope.$new();
        $controller('VendingController', {'$scope': $scope});
    }));

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
