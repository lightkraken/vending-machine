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
  });
});
