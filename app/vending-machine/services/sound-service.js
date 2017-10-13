'use strict';

angular.module('vendingApp')

.service('SoundService', [
  function (){

    this.insertValidCoin = new Howl({
      src: ['sounds/insertcoin.mp3', 'sounds/insertcoin.wav']
      //https://freesound.org/people/ehproductions/sounds/90397/
    });

    this.returnSingleCoin = new Howl({
      src: ['sounds/returnsinglecoin.mp3', 'sounds/returnsinglecoin.wav']
      //https://freesound.org/people/tweeterdj/sounds/29649/
    });

    this.returnMultipleCoins = new Howl({
      src: ['sounds/returnmultiplecoins.mp3', 'sounds/returnmultiplecoins.wav']
      //https://freesound.org/people/tweeterdj/sounds/29642/
    });

    this.returnCoinToStack = new Howl({
      src: ['sounds/returncointostack.mp3', 'sounds/returncointostack.wav']
      //https://freesound.org/people/bradwesson/sounds/135936/
    });

    this.vend = new Howl({
      src: ['sounds/vend.mp3', 'sounds/vend.wav']
      //https://freesound.org/people/rjonander6/sounds/250962/
    });

    this.numpad = new Howl({
      src: ['sounds/numpad.mp3', 'sounds/numpad.wav']
      //https://freesound.org/people/DrMinky/sounds/166184/
    });

    this.item = new Howl({
      src: ['sounds/item.mp3', 'sounds/item.wav']
      //https://freesound.org/people/tyops/sounds/250843/
    });

}]);
