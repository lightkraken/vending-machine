'use strict';

angular.module('vendingApp.vendingMachine', [])

.constant('COINS', {
  NICKEL: {
    weight: 5000, //mg
    diameter: 21210, //μm
    thickness: 1950, //μm
    value: 5, //cents
    label: 'nickel'
  },
  DIME: {
    weight: 2268, //mg
    diameter: 17910, //μm
    thickness: 1350, //μm
    value: 10, //cents
    label: 'dime'
  },
  QUARTER: {
    weight: 5670, //mg
    diameter: 24260, //μm
    thickness: 1750, //μm
    value: 25, //cents
    label: 'quarter'
  }
})

.constant('ITEMS', {
  color: {
    RED: 'red',
    GREEN: 'green',
    BLUE: 'blue'
  },
  type: {
    CANDY: 'candy',
    SODA: 'soda',
    CHIPS: 'chips'
  }
})

.constant('MESSAGES', {
  INSERTCOIN: "INSERT COIN",
  EXACTCHANGE: "EXACT CHANGE ONLY",
  SOLDOUT: "SOLD OUT",
  PRICE: "PRICE",
  THANKYOU: "THANK YOU"
})

.constant('STATES', {
  IDLE: 'idle',
  MONEY: 'money',
  DISABLED: 'disabled'
})

.constant('PRICES', [
  50,
  65,
  100
]);
