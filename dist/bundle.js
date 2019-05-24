/* !
  * library v1.0.0
  * https://github.com/  (github address)
  * 
  * (c) 2019 AuthorName
  */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.library = factory());
}(this, function () { 'use strict';

    var msg = 'Hello Rollup';

    console.log(msg);

    var Super = function Super() {
      this.author = 'Zoro';
      this.version = '1.0.0';
    };

    Super.prototype.sayAuhtor = function sayAuhtor() {
      console.log(this.author);
    };

    Super.prototype.delay = function delay(times) {
      return new Promise(function (resolve) {
        var timer = setTimeout(function () {
          resolve();
        }, times);
      });
    };

    Super.prototype.update = function update(version) {
      this.version = version;
    };

    return Super;

}));
