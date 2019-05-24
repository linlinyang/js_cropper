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

    function initMixin(JSCropper) {
      JSCropper.prototype._init = function (options) {
        this._originOpts = options;
        Object.assign(this, {
          maxSize: 2000,
          cropperWidth: 800,
          cropperHeight: 600,
          width: 300,
          height: 300,
          shadowColor: rgba(0, 0, 0, 0.7),
          edgeLineColor: '#fff',
          edgeLineWidth: 3,
          dashLineColor: 'rgba(255,255,255,0.8)',
          quality: 1,
          imgType: 'image/png',
          inSelectBackColor: 'rgba(0,0,0,0.6)',
          selectBackColor: 'rgba(0,0,0,0.2)',
          scalable: true,
          scaleStep: 0.02
        }, options);
        this._zoom = 2;
      };
    }

    /* /src/index.js */

    var JSCropper = function JSCropper(options) {
      this._init(options);
    };

    initMixin(JSCropper);

    return JSCropper;

}));
