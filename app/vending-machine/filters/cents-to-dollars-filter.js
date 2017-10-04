'use strict';

angular.module('vendingApp')

.filter('centsToDollars', [
  function(){
    return function(num){
      num = num.toString();
      while (num.length < 3) {
        num = "0" + num;
      }
      num = '$'+ num.slice(0,-2) + '.' + num.slice(-2);
      return num;
    };
}]);
