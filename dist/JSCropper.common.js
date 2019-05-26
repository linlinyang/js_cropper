/* !
  * JSCropper v1.0.0
  * https://github.com/linlinyang/js_cropper.git
  * 
  * (c) 2019 Yang Lin
  */

'use strict';

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
    '[object Null]': 'null'
  };
  return map[type];
}
/* 
 * 根据设备像素比来设置画布缩放
 *
 * @params {CanvasRenderingContext2D} ctx;2d画布绘图对象
 * 
 * @return {Number};返回计算出的画布缩放
 */


function getZoom() {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var devicePixelRadio = window.devicePixelRatio || 1;
  var backingStore = ctx.backingStorePixelRatio || ctx.webkitBackingStorePixelRadio || ctx.mozBackingStorePixelRadio || ctx.msBackingStorePixelRadio || ctx.oBackingStorePixedRadio || 1;
  canvas = null;
  return devicePixelRadio / backingStore;
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

function callHook$1(jc, hook) {
  var handler = jc[hook];
  typeof handler === 'function' && handler.call(jc);
}

function lifyCircleMixin(JSCropper) {
  JSCropper.prototype.destroy = function () {
    callHook$1(this, 'beforeDestory');
  };
}

/* /src/init.js */
var uid = 1;

function initMixin(JSCropper) {
  JSCropper.prototype._init = function (options) {
    var jc = this;
    jc._originOpts = options;
    Object.assign(jc, {
      maxSize: 2000,
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
      selectBackColor: 'rgba(0,0,0,0.2)',
      scalable: true,
      scaleStep: 0.02
    }, options);
    jc._uid = uid++;

    jc._redraw();

    callHook$1(jc, 'created');
  };
}

function resizeCanvas(canvas, width, height, zoom) {
  if (zoom === void 0) zoom = 1;
  var ctx = canvas.getContext('2d');
  var zoomWidth = width * zoom;
  var zoomHeight = height * zoom;
  canvas.width = zoomWidth;
  canvas.height = zoomHeight;
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  return {
    zoomWidth: zoomWidth,
    zoomHeight: zoomHeight
  };
}

function canvasMixin(JSCropper) {
  JSCropper.prototype._restore = function () {
    var jc = this;
    var ctx = jc.ctx;
    var width = jc.cropperWidth * jc._zoom;
    var height = jc.cropperHeight * jc._zoom;
    jc._imageSource = ctx.getImageData(0, 0, width, height);
  };

  JSCropper.prototype._initCanvas = function () {
    var jc = this;
    callHook$1(jc, 'beforeCreate');
    var el = jc.el;
    var canvas;

    if (typeOf(el) === 'string') {
      canvas = document.querySelector(el);
    } else if (typeOf(el) === 'object' && toLowerCase.call(el.nodeName) === 'canvas' && el.nodeType === 1) {
      canvas = el;
    }

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.innerHTML = 'Your browser does not support canvas';
    }

    var zoom = jc._zoom;
    var width = jc.cropperWidth;
    var height = jc.cropperHeight;
    resizeCanvas(canvas, width, height, zoom);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    !canvas.parentNode && document.body.appendChild(canvas);
    jc.canvas = canvas;
  };

  JSCropper.prototype._offscreenBuffering = function () {
    var jc = this;
    var bufferCanvas = document.createElement('canvas');
    var bufferCtx = bufferCanvas.getContext('2d');
    var zoom = jc._zoom;
    var width = jc.cropperWidth;
    var height = jc.cropperHeight;
    var ref = resizeCanvas(bufferCanvas, width, height, zoom);
    var zoomWidth = ref.zoomWidth;
    var zoomHeight = ref.zoomHeight;
    bufferCtx.clearRect(0, 0, zoomWidth, zoomHeight);
    bufferCtx.save();
    bufferCtx.fillStyle = jc.shadowColor;
    bufferCtx.fillRect(0, 0, zoomWidth, zoomHeight);
    bufferCtx.restore();
    jc.bufferCanvas = bufferCanvas;
    document.body.appendChild(bufferCanvas);
  };
}

var toLowerCase$1 = String.prototype.toLowerCase;

function loadFail() {
  callHook$1(jc, 'imgLoaded');
  throw new Error('Load image fail, please check your image');
}
/* 
 * 根据配置加载图片
 * 
 * 图片为String类型则作为图片路径处理
 * 图片是Image对象，则直接使用
 * 其他类型抛出错误
 */


function loadImage(jc) {
  var img = jc.img || jc.image;

  if (!img || img === jc._img) {
    return;
  }

  callHook$1(jc, 'beforeImgLoaded');

  if (typeOf(img) === 'string') {
    var targetImg = new Image();

    targetImg.onload = function () {
      jc._targetImg = targetImg;
      jc._img = img;
    };

    targetImg.onerror = loadFail;
    targetImg.src = img;
  } else if (typeOf(img) === 'object' && toLowerCase$1.call(img) === 'img' && img.nodeType === 1) {
    img.onload = function () {
      jc._targetImg = img;
      jc._img = img;
    };

    img.onerror = loadFail;
  } else {
    loadFail();
  }
}

function initImage(jc) {
  var targetImg = jc._targetImg;
  var originImgWidth = targetImg.width;
  var originImgHeight = targetImg.height;
  var cropperWidth = jc.cropperWidth;
  var cropperHeight = jc.cropperHeight;
  var zoom = jc._zoom;
  var width = cropperWidth * zoom;
  var height = cropperHeight * zoom;
  var imgWidth = originImgWidth * zoom;
  var imgHeight = originImgHeight * zoom;
  var radio = Math.max(imgWidth / cropperWidth, imgHeight / cropperHeight);
  console.log(imgWidth / cropperWidth, imgHeight / cropperHeight);
  imgWidth = imgWidth / radio;
  imgHeight = imgHeight / radio;
  var imgSource = document.createElement('canvas');
  var ctx = imgSource.getContext('2d');
  imgSource.width = width;
  imgSource.height = height;
  ctx.drawImage(targetImg, 0, 0, originImgWidth, originImgWidth, 0, 0, imgWidth, imgHeight);
  document.body.appendChild(imgSource);
}
/* 
 * 向画布中绘制背景图，并保存绘图数据
 */


function drawImage(jc) {
  var targetImg = jc._targetImg;
  console.log(targetImg.width, targetImg.height);
}

function drawMixin(JSCropper) {
  var cropperImage = null;

  JSCropper.prototype._redraw = function () {
    var jc = this;
    jc._zoom = getZoom();

    jc._initCanvas();

    jc._offscreenBuffering(jc);

    Object.defineProperty(jc, '_img', {
      set: function set(newVal) {
        if (newVal === cropperImage) {
          return;
        }

        jc._img = cropperImage = newVal;
        initImage(jc);
        drawImage(jc);
      },
      get: function get() {
        return cropperImage;
      }
    });
    loadImage(jc);
  };

  JSCropper.prototype.update = function (options) {
    var jc = this;
    callHook(jc, 'beforeUpdate');

    if (Object.keys(options) === 0) {
      return;
    }

    Object.assign(jc, options);

    jc._redraw();

    callHook(jc, 'updated');
  };

  JSCropper.prototype.reset = function () {
    callHook(this, 'beforeReset');
  };
}

/* /src/index.js */

var JSCropper = function JSCropper(options) {
  this._init(options);
};

initMixin(JSCropper);
lifyCircleMixin(JSCropper);
canvasMixin(JSCropper);
drawMixin(JSCropper);
JSCropper.version = '1.0.0';

module.exports = JSCropper;
