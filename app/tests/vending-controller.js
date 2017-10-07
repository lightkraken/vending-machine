'use strict';

describe('app module', function() {

  beforeEach(module('vendingApp'));

  describe('vending controller', function(){
    var $scope;
    var $q;
    var STATES;
    var COINS;
    var CashService;
    var OutputService;
    var StateService;
    var MessageService;
    var InventoryService;

    beforeEach(inject(function ($rootScope, $controller, _$q_, _STATES_, _COINS_,
                                _CashService_, _StateService_, _OutputService_,
                                _MessageService_, _InventoryService_) {
        $scope = $rootScope.$new();
        $controller('VendingController', {'$scope': $scope});
        $q = _$q_;
        STATES = _STATES_;
        COINS = _COINS_;
        CashService = _CashService_;
        OutputService = _OutputService_;
        StateService = _StateService_;
        MessageService = _MessageService_;
        InventoryService = _InventoryService_;
    }));

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

          it('should transition the vending machine to the money state', function(){
            expect(StateService.state).toEqual(STATES.IDLE);
            $scope.insertCoin(COINS.NICKEL);
            expect(StateService.state).toEqual(STATES.MONEY);
          });

        });

        describe('with an invalid coin', function(){

          it('should return the coin', function(){
            expect(OutputService.returnedItems).toEqual([]);
            $scope.insertCoin(penny);
            expect(OutputService.returnedItems).toEqual([penny]);
          });

        });

      });

      describe('on money state', function(){

        beforeEach(function(){
          $scope.insertCoin(COINS.QUARTER);
        });

        describe('with a valid coin', function(){

          it('should add the value to the total credits', function(){
            expect(StateService.state).toEqual(STATES.MONEY);
            expect(CashService.getTotalCredit()).toEqual(25);
            $scope.insertCoin(COINS.QUARTER);
            expect(CashService.getTotalCredit()).toEqual(50);
          });

        });

        describe('with an invalid coin', function(){

          it('should return the coin', function(){
            expect(StateService.state).toEqual(STATES.MONEY);
            expect(OutputService.returnedItems).toEqual([]);
            $scope.insertCoin(penny);
            expect(OutputService.returnedItems).toEqual([penny]);
          });

        });

        describe('with $1.00 or more of credit', function(){

          it('should return the coin', function(){
            expect(StateService.state).toEqual(STATES.MONEY);
            expect(OutputService.returnedItems).toEqual([]);
            expect(CashService.getTotalCredit()).toEqual(25);
            $scope.insertCoin(COINS.QUARTER);
            $scope.insertCoin(COINS.QUARTER);
            $scope.insertCoin(COINS.QUARTER);
            expect(CashService.getTotalCredit()).toEqual(100);
            $scope.insertCoin(COINS.QUARTER);
            expect(CashService.getTotalCredit()).toEqual(100);
            expect(OutputService.returnedItems).toEqual([COINS.QUARTER]);
          });

        });

      });

      describe('on disabled state', function(){

        it('should return the coin', function(){
          StateService.setDisabled();
          expect(OutputService.returnedItems).toEqual([]);
          $scope.insertCoin(COINS.DIME);
          expect(OutputService.returnedItems).toEqual([COINS.DIME]);
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
          expect(StateService.state).toEqual(STATES.MONEY);
          expect(OutputService.returnedItems).toEqual([]);
          $scope.refund();
          expect(OutputService.returnedItems).toEqual([COINS.QUARTER]);
        });

        it('should transition the vending machine to the idle state', function(){
          expect(StateService.state).toEqual(STATES.MONEY);
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
            spyOn(InventoryService, 'inStock').and.returnValue(true);
            spyOn(MessageService, 'notifyPrice');
            $scope.chooseItem(_.random(2), _.random(2));
            expect(MessageService.notifyPrice).toHaveBeenCalledTimes(1);
          });

        });

        describe('and item is out of stock', function(){

          it('should display SOLD OUT', function(){
            spyOn(InventoryService, 'inStock').and.returnValue(false);
            spyOn(MessageService, 'notifySoldOut');
            $scope.chooseItem(_.random(2), _.random(2));
            expect(MessageService.notifySoldOut).toHaveBeenCalledTimes(1);
          });

        });

      });

      describe('on money state', function(){

        beforeEach(function(){
          StateService.state = STATES.MONEY;
        });

        describe('and item is in stock', function(){

          beforeEach(function(){
            spyOn(InventoryService, 'inStock').and.returnValue(true);
          });

          describe('and user has inserted enough money', function(){

            var insertedCash = 105;

            beforeEach(function(){
              spyOn(CashService, 'getTotalCredit').and.returnValue(insertedCash);
              spyOn(CashService, 'pay');
              spyOn(InventoryService, 'retrieveItem');
              spyOn(OutputService, 'dispenseItem');
              spyOn(MessageService, 'notifyThankYou').and.returnValue($q.when({}));
            });

            it('should dispense the item', function(){
              $scope.chooseItem(_.random(2), _.random(2));
              expect(InventoryService.retrieveItem).toHaveBeenCalledTimes(1);
              expect(OutputService.dispenseItem).toHaveBeenCalledTimes(1);
            });

            it('should return any change', function(){
              CashService.pay.and.returnValue(COINS.NICKEL);
              $scope.chooseItem(_.random(2), _.random(2));
              expect($scope.returnedItems).toEqual([COINS.NICKEL]);
            });

            it('should display THANK YOU for a moment', function(){
              $scope.chooseItem(_.random(2), _.random(2));
              expect(MessageService.notifyThankYou).toHaveBeenCalledTimes(1);
            });

            it('should return the vending machine to the idle state', function(){
              spyOn(StateService, 'setIdle');
              $scope.chooseItem(_.random(2), _.random(2));
              $scope.$digest();
              expect(StateService.setIdle).toHaveBeenCalledTimes(1);
            });

          });

          describe('and user has not inserted enough money', function(){

            it('should display the price of the item', function(){
              spyOn(CashService, 'getTotalCredit').and.returnValue(10);
              spyOn(MessageService, 'notifyPrice');
              $scope.chooseItem(_.random(2), _.random(2));
              expect(MessageService.notifyPrice).toHaveBeenCalledTimes(1);
            });

          });

        });

        describe('and item is out of stock', function(){

          it('should display SOLD OUT', function(){
            spyOn(InventoryService, 'inStock').and.returnValue(false);
            spyOn(MessageService, 'notifySoldOut');
            $scope.chooseItem(_.random(2), _.random(2));
            expect(MessageService.notifySoldOut).toHaveBeenCalledTimes(1);
          });

        });

      });

      describe('on disabled state', function(){

        it('should do nothing', function(){
          spyOn(InventoryService, 'inStock');
          StateService.state = STATES.DISABLED;
          $scope.chooseItem(_.random(2), _.random(2));
          expect(InventoryService.inStock).not.toHaveBeenCalled();
        });

      });

    });

  });

});
