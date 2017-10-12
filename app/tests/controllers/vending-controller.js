'use strict';

describe('app module', function() {

  beforeEach(module('vendingApp'));

  describe('vending controller', function(){
    var $scope;
    var $timeout;
    var STATES;
    var COINS;
    var MESSAGES;
    var ITEMS;
    var CashService;
    var OutputService;
    var StateService;
    var MessageService;
    var InventoryService;
    var CoinValidatorService;

    beforeEach(inject(function ($rootScope, $controller, _$timeout_, _STATES_, _COINS_, _MESSAGES_,
                                _ITEMS_, _CashService_, _StateService_, _OutputService_,
                                _MessageService_, _InventoryService_, _CoinValidatorService_) {
        $scope = $rootScope.$new();
        $controller('VendingController', {'$scope': $scope});
        $timeout = _$timeout_;
        STATES = _STATES_;
        COINS = _COINS_;
        MESSAGES = _MESSAGES_;
        ITEMS = _ITEMS_;
        CashService = _CashService_;
        OutputService = _OutputService_;
        StateService = _StateService_;
        MessageService = _MessageService_;
        InventoryService = _InventoryService_;
        CoinValidatorService = _CoinValidatorService_;
    }));

    describe('when inventory is updated', function(){

      it('should update the displayed inventory', function(){
        $scope.$digest();
        expect($scope.inventory).toEqual(InventoryService.inventory);
      });

    });

    describe('when message is updated', function(){

      it('should update the displayed message', function(){
        $scope.$digest();
        expect($scope.message).toEqual(MessageService.message);
      });

    });

    describe('when item is dispensed', function(){

      it('should appear in the dispended item tray', function(){
        var item = {thing: 'item'};
        OutputService.dispenseItem(item);
        $scope.$digest();
        expect($scope.dispensedItems).toEqual(OutputService.dispensedItems);
      });

    });

    describe('when item is returned', function(){

      it('should appear in the coin return', function(){
        var badCoin = {thing: 'coin'};
        OutputService.returnItems(badCoin);
        $scope.$digest();
        expect($scope.returnedItems).toEqual(OutputService.returnedItems);
      });

    });

    describe('when user inserts a coin', function(){

      var penny = {
        weight: 2500,
        diameter: 19050,
        thickness: 1520
      };

      describe('on idle state', function(){

        beforeEach(function(){
          StateService.setIdle();
        });

        describe('with a valid coin', function(){

          it('should add the value to the total credits', function(){
            expect(CashService.getTotalCredit()).toEqual(0);
            $scope.insertCoin(COINS.NICKEL);
            expect(CashService.getTotalCredit()).toEqual(5);
          });

          it('should make the refund button active', function(){
            expect($scope.hasInsertedCash).toBe(false);
            $scope.insertCoin(COINS.NICKEL);
            expect($scope.hasInsertedCash).toBe(true);
          });

          it('should transition the vending machine to the money state', function(){
            expect(StateService.state).toEqual(STATES.IDLE);
            $scope.insertCoin(COINS.NICKEL);
            expect(StateService.state).toEqual(STATES.MONEY);
          });

        });

        describe('with an invalid coin', function(){

          it('should return the coin', function(){
            expect($scope.returnedItems).toEqual([]);
            $scope.insertCoin(penny);
            $scope.$digest();
            expect($scope.returnedItems).toEqual([penny]);
          });

        });

      });

      describe('on money state', function(){

        beforeEach(function(){
          $scope.insertCoin(COINS.QUARTER);
        });

        describe('with a valid coin', function(){

          it('should add the value to the total credits', function(){
            expect(CashService.getTotalCredit()).toEqual(25);
            $scope.insertCoin(COINS.QUARTER);
            expect(CashService.getTotalCredit()).toEqual(50);
          });

        });

        describe('with an invalid coin', function(){

          it('should return the coin', function(){
            expect($scope.returnedItems).toEqual([]);
            $scope.insertCoin(penny);
            $scope.$digest();
            expect($scope.returnedItems).toEqual([penny]);
          });

        });

        describe('with $1.00 or more of credit', function(){

          it('should return the coin', function(){
            expect($scope.returnedItems).toEqual([]);
            expect(CashService.getTotalCredit()).toEqual(25);
            $scope.insertCoin(COINS.QUARTER);
            $scope.insertCoin(COINS.QUARTER);
            $scope.insertCoin(COINS.QUARTER);
            expect(CashService.getTotalCredit()).toEqual(100);
            $scope.insertCoin(COINS.QUARTER);
            expect(CashService.getTotalCredit()).toEqual(100);
            $scope.$digest();
            expect($scope.returnedItems).toEqual([COINS.QUARTER]);
          });

        });

      });

      describe('on disabled state', function(){

        it('should return the coin', function(){
          StateService.setDisabled();
          expect($scope.returnedItems).toEqual([]);
          $scope.insertCoin(COINS.DIME);
          $scope.$digest();
          expect($scope.returnedItems).toEqual([COINS.DIME]);
        });

      });

    });

    describe('when user presses refund', function(){

      beforeEach(function(){
        spyOn(OutputService, 'returnItems').and.callThrough();
      });

      describe('on idle state', function(){

        it('should do nothing', function(){
          StateService.setIdle();
          $scope.refund();
          expect(OutputService.returnItems).not.toHaveBeenCalled();
        });

      });

      describe('on money state', function(){

        beforeEach(function(){
          $scope.insertCoin(COINS.QUARTER);
        });

        it('should return the coins that have been inserted', function(){
          expect($scope.returnedItems).toEqual([]);
          $scope.refund();
          $scope.$digest();
          expect($scope.returnedItems).toEqual([COINS.QUARTER]);
        });

        it('should make the refund button inactive', function(){
          expect($scope.hasInsertedCash).toBe(true);
          $scope.refund();
          expect($scope.hasInsertedCash).toBe(false);
        });

        it('should transition the vending machine to the idle state', function(){
          $scope.refund();
          expect(StateService.state).toEqual(STATES.IDLE);
        });

      });

      describe('on disabled state', function(){

        it('should do nothing', function(){
          StateService.setDisabled();
          $scope.refund();
          expect(OutputService.returnItems).not.toHaveBeenCalled();
        });

      });

    });

    describe('when user chooses an item', function(){

      describe('on idle state', function(){

        describe('and item is in stock', function(){

          it('should show the price of the item', function(){
            InventoryService.inventory[0][0].push('item');
            $scope.chooseItem(0,0);
            expect(MessageService.message).toEqual("PRICE $0.50");
          });

        });

        describe('and item is out of stock', function(){

          it('should display SOLD OUT', function(){
            InventoryService.inventory[0][0] = [];
            $scope.chooseItem(0,0);
            expect(MessageService.message).toEqual(MESSAGES.SOLDOUT);
          });

        });

      });

      describe('on money state', function(){

        beforeEach(function(){
          $scope.insertCoin(COINS.QUARTER);
        });

        describe('and item is in stock', function(){

          var mockItem = {item: 'item'};

          beforeEach(function(){
            InventoryService.inventory[0][0].push(mockItem);
          });

          describe('and user has inserted enough money', function(){

            beforeEach(function(){
              $scope.insertCoin(COINS.DIME);
              $scope.insertCoin(COINS.DIME);
              $scope.insertCoin(COINS.DIME);
            });

            it('should dispense the item', function(){
              $scope.chooseItem(0,0);
              $scope.$digest();
              expect($scope.dispensedItems).toEqual([mockItem]);
            });

            it('should return any change', function(){
              $scope.chooseItem(0,0);
              $scope.$digest();
              expect(CoinValidatorService.validateCoin($scope.returnedItems[0])).toEqual(COINS.NICKEL.label);
            });

            it('should display THANK YOU', function(){
              $scope.chooseItem(0,0);
              $scope.$digest();
              expect($scope.message).toEqual(MESSAGES.THANKYOU);
            });

            it('should return the vending machine to the idle state', function(){
              $scope.chooseItem(0,0);
              $timeout.flush();
              $scope.$digest();
              expect(StateService.state).toEqual(STATES.IDLE);
            });

          });

          describe('and user has not inserted enough money', function(){

            it('should display the price of the item', function(){
              $scope.chooseItem(0,0);
              $scope.$digest();
              expect(MessageService.message).toEqual("PRICE $0.50");
            });

          });

        });

        describe('and item is out of stock', function(){

          it('should display SOLD OUT', function(){
            InventoryService.inventory[0][0] = [];
            $scope.chooseItem(0,0);
            $scope.$digest();
            expect($scope.message).toEqual(MESSAGES.SOLDOUT);
          });

        });

      });

      describe('on disabled state', function(){

        it('should do nothing', function(){
          spyOn(InventoryService, 'inStock');
          StateService.setDisabled();
          $scope.chooseItem(_.random(2), _.random(2));
          expect(InventoryService.inStock).not.toHaveBeenCalled();
        });

      });

    });

  });

});
