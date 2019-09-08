/* !
  * JSCropper v2.0.0
  * https://github.com/linlinyang/js_cropper.git
  * 
  * (c) 2019 Yang Lin
  */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.JSCropper = factory());
}(this, function () { 'use strict';

    /* 
     * 工具方法
     */
    var toString = Object.prototype.toString;
    /* 
     * 返回数据类型
     *
     * @params {any} any;要检测的js基本数据类型
     * 
     * @return {String};返回待检测数据类型
     */

    function typeOf(any) {
      var type = toString.call(any);
      var map = {
        '[object Object]': 'object',
        '[object Array]': 'array',
        '[object Number]': 'number',
        '[object Boolean]': 'boolean',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Symbol]': 'symbol'
      };
      return map[type];
    }

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    /* 
     * 为Obejct方法定义assign方法，兼容ie，执行浅拷贝合并
     */

    if (typeOf(Object.assign) !== 'function') {
      Object.defineProperty(Object, 'assign', {
        value: function value(target) {

          var arguments$1 = arguments;

          if (to === null) {
            return to;
          }

          var len = arguments.length;
          var to = Object(target);

          for (var i = 1; i < len; i++) {
            var source = arguments$1[i];

            for (var key in source) {
              if (hasOwnProperty.call(source, key)) {
                to[key] = source[key];
              }
            }
          }

          return to;
        },
        writable: true,
        configurable: true,
        enumerable: false
      });
    }

    var configOptions = {
      cropperWidth: 800,
      cropperHeight: 600,
      width: 300,
      height: 300,
      shadowColor: 'rgba(0,0,0,0.7)',
      edgeLineColor: '#fff',
      edgeLineWidth: 3,
      dashLineColor: 'rgba(255,255,255,0.8)',
      quality: 1,
      imgType: 'image/png',
      inSelectBackColor: 'rgba(0,0,0,0.6)',
      selectBackColor: 'rgba(0,0,0,0.4)',
      rotate: 0,
      scale: 1,
      drawCropperBox: true,
      debug: true
    };

    /* /src/core/instance/wrapper */
    function initWrapper(jc) {
      var el = jc.el;
    }

    /* /src/core/instance/lifecycls.js */
    function callhook(jc, hook) {
      var handler = jc[hook];

      if (handler && typeOf(handler) === 'function') {
        handler.call(jc);
      }
    }

    /* /src/core/instance/updateMixin */
    function updateMixin(JSCropper) {
      var uid = 1;

      JSCropper.prototype._update = function (options) {
        var jc = this;
        Object.assign(jc, configOptions, options);
        jc._uid = uid++;
        jc.debug && console.log('开始绘制裁剪窗...');
        callhook('breforeCreate');
        initWrapper(jc);
        return jc;
      };

      JSCropper.prototype.update = function (options) {
        return this._update(options);
      };
    }

    /* /src/core/instance/index.js */

    var JSCropper = function JSCropper(options) {
      this._update(options);
    };

    updateMixin(JSCropper);

    function getVersion() {
      return "2.0.0";
    }

    /* /src/core/global-api */
    function initGlobalAPI(JSCropper) {
      JSCropper.getVersion = getVersion;
      JSCropper.typeOf = typeOf;
    }

    /* /src/index.js */
    initGlobalAPI(JSCropper);

    /* /src/index.js */
    JSCropper.version = '2.0.0';

    return JSCropper;

}));
