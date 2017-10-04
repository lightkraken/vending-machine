'use strict';

describe('vendingApp', function() {

  beforeEach(module('vendingApp'));

  describe('centsToDollars filter', function(){
    var $filter;

    beforeEach(inject(function (_$filter_) {
      $filter = _$filter_;
    }));

    describe('filtering', function(){
      it('should convert cents to dollars', function(){
        expect($filter('centsToDollars')(5)).toEqual('$0.05');
        expect($filter('centsToDollars')(63)).toEqual('$0.63');
        expect($filter('centsToDollars')(158)).toEqual('$1.58');
      });
    });

  });
});
