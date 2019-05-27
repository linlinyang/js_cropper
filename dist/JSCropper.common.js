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

function callHook(jc, hook) {
  var handler = jc[hook];
  typeof handler === 'function' && handler.call(jc);
}

function lifyCircleMixin(JSCropper) {
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

  JSCropper.prototype.destroy = function () {
    callHook(this, 'beforeDestory');
  };

  JSCropper.prototype.reset = function () {
    callHook(this, 'beforeReset');
  };
}

/* /src/init.js */
var uid = 1;

function initMixin(JSCropper) {
  JSCropper.prototype._init = function (options) {
    var jc = this;
    jc._originOpts = options;
    Object.assign(jc, {
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
      selectBackColor: 'rgba(0,0,0,0.2)'
    }, options);
    jc._uid = uid++;

    jc._redraw();

    callHook(jc, 'created');
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
    callHook(jc, 'beforeCreate');
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

  JSCropper.prototype._renderOffScreen = function () {
    var jc = this;
    var bufferCanvas = jc.bufferCanvas;
    var canvas = jc.canvas;
    var cropperWidth = jc.cropperWidth;
    var cropperHeight = jc.cropperHeight;
    var zoom = jc._zoom;
    var ctx = canvas.getContext('2d');
    var width = cropperWidth * zoom;
    var height = cropperHeight * zoom;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(bufferCanvas, 0, 0, width, height, 0, 0, width, height);
  };
}

var toLowerCase$1 = String.prototype.toLowerCase;
/* 
 * 图片加载失败，抛出错误
 */

function loadFail() {
  callHook(jc, 'imgLoaded');
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

  callHook(jc, 'beforeImgLoaded');

  if (typeOf(img) === 'string') {
    var targetImg = new Image();

    targetImg.onload = function () {
      jc._sourceImg = targetImg;
      jc._img = img;
    };

    targetImg.onerror = loadFail;
    targetImg.src = img;
  } else if (typeOf(img) === 'object' && toLowerCase$1.call(img) === 'img' && img.nodeType === 1) {
    img.onload = function () {
      jc._sourceImg = img;
      jc._img = img;
    };

    img.onerror = loadFail;
  } else {
    loadFail();
  }
}

function initImage(jc) {
  var cropperWidth = jc.cropperWidth;
  var cropperHeight = jc.cropperHeight;
  var zoom = jc._zoom;
  var jc_sourceImg = jc._sourceImg;
  var width = jc_sourceImg.width;
  var height = jc_sourceImg.height;
  var ratio = Math.min(cropperWidth / width, cropperHeight / height);
  Object.assign(jc, {
    _imgWidth: width * ratio * zoom,
    _imgHeight: height * ratio * zoom
  });
}
/* 
 * 向画布中绘制背景图，并保存绘图数据
 */


function drawImage(jc) {
  var bufferCanvas = jc.bufferCanvas;
  var sourceImg = jc._sourceImg;
  var cropperWidth = jc.cropperWidth;
  var cropperHeight = jc.cropperHeight;
  var imgWidth = jc._imgWidth;
  var imgHeight = jc._imgHeight;
  var zoom = jc._zoom;
  var width = sourceImg.width;
  var height = sourceImg.height;
  var ctx = bufferCanvas.getContext('2d');
  var dx = (cropperWidth * zoom - imgWidth) / 2;
  var dy = (cropperHeight * zoom - imgHeight) / 2;
  ctx.drawImage(sourceImg, 0, 0, width, height, dx, dy, imgWidth, imgHeight);
}

/* 
 * 画布线条操作
 *
 * 线条绘制时都是基于线条中间开始绘制，就会存在如下bug
 * 
 * 例如绘制一条(100,300)到(200,300)的水平线条
 * 当要绘制的线条宽度是奇数时，假如设置为1，则线条就会在y轴方向299.5~300.5之间绘制一条线宽为1的直线，但是，由于canvas的渲染机制，无法渲染半个像素，所以299至301都会被填充，就会出现线条宽度变成2的效果，但是线条颜色会淡很多
 * 当要绘制的线条宽度是偶数时，假如设置为2，则线条会在y轴方向300上向上向下扩张1px，即299~301之间绘制一条2px的直线，没有多余，所以线条颜色就是设置的颜色
 * 
 * 所以如果线宽是偶数时，线条的位置就要在整数的坐标上；反之，则要偏移半个像素来绘制所要达到的效果
 */
function convertNum(coord, lineWidth) {
  return Math.floor(coord) + lineWidth % 2 / 2;
}
/* 
 * 根据方向绘制矩形，默认顺时针方向
 *
 * @params {CanvasRenderingContext2D} ctx;2d画布绘图对象
 * @params {Number} x;矩形起点x坐标
 * @params {Number} y;矩形起点y坐标
 * @params {Number} width;矩形宽度
 * @params {Number} height;矩形高度
 * @params {Boolean} counterClockWise;是否逆时针绘制
 * @params {Boolean} isSolid;是否需要转换为实线
 */


function rect(ctx, x, y, width, height, counterClockWise, isSolid) {
  if (counterClockWise === void 0) counterClockWise = false;
  if (isSolid === void 0) isSolid = false;
  var lineWidth = ctx.lineWidth;
  console.log(lineWidth);
  var xDistance = x + width;
  var yDistance = y + height;

  if (isSolid) {
    x = convertNum(x, lineWidth);
    y = convertNum(y, lineWidth);
    xDistance = convertNum(x + width, lineWidth);
    yDistance = convertNum(y + height, lineWidth);
  }

  if (!counterClockWise) {
    //顺时针
    ctx.moveTo(x, y);
    ctx.lineTo(xDistance, y);
    ctx.lineTo(xDistance, yDistance);
    ctx.lineTo(x, yDistance);
    ctx.lineTo(x, y);
  } else {
    //逆时针
    ctx.moveTo(x, y);
    ctx.lineTo(x, yDistance);
    ctx.lineTo(xDistance, yDistance);
    ctx.lineTo(xDistance, y);
    ctx.lineTo(x, y);
  }
}

/* 
 * 重置裁剪框位置，在画布中间
 */

function resetPos(jc) {
  var width = jc.width;
  var height = jc.height;
  var zoom = jc._zoom;
  var cropperWidth = jc.cropperWidth;
  var cropperHeight = jc.cropperHeight;
  jc._x = (cropperWidth - width) * zoom / 2;
  jc._y = (cropperHeight - height) * zoom / 2;
}
/* 
 * 绘制裁剪框与画布之间的阴影
 */


function drawShadow(jc) {
  var bufferCanvas = jc.bufferCanvas;
  var cropperWidth = jc.cropperWidth;
  var cropperHeight = jc.cropperHeight;
  var width = jc.width;
  var height = jc.height;
  var x = jc._x;
  var y = jc._y;
  var zoom = jc._zoom;
  var isDragging = jc.isDragging;
  var ctx = bufferCanvas.getContext('2d');
  ctx.save();
  ctx.beginPath();
  rect(ctx, 0, 0, cropperWidth * zoom, cropperHeight * zoom); //顺时针画外框

  rect(ctx, x, y, width * zoom, height * zoom, true); //逆时针画内框

  ctx.fillStyle = isDragging ? jc.selectBackColor : jc.inSelectBackColor;
  ctx.fill(); //根据环绕原则，填充颜色

  ctx.restore();
}

function drawCropGride(jc) {
  var bufferCanvas = jc.bufferCanvas;
  var cropperWidth = jc.cropperWidth;
  var cropperHeight = jc.cropperHeight;
  var width = jc.width;
  var height = jc.height;
  var x = jc._x;
  var y = jc._y;
  var zoom = jc._zoom;
  var edgeLineColor = jc.edgeLineColor;
  var ctx = bufferCanvas.getContext('2d');
  ctx.save();
  ctx.lineWidth = 1; //ctx.strokeStyle = edgeLineColor * zoom;

  ctx.strokeStyle = 'red';
  ctx.beginPath(); //rect( ctx, x, y, width * zoom, height * zoom, true, true);

  rect(ctx, 10, 10, 30, 30, false, true);
  ctx.stroke();
  rect(ctx, 50.5, 50.5, 30, 30, false, true);
  ctx.stroke();
  ctx.lineWidth = 2;
  rect(ctx, 100, 100, 30, 30, false, true);
  ctx.stroke();
  rect(ctx, 150.5, 150.5, 30, 30, false, true);
  ctx.stroke();
  ctx.restore();
}

function drawCropBox(jc) {
  var bufferCanvas = jc.bufferCanvas;
  var x = jc._x;
  var y = jc._y;

  if (x === undefined || y === undefined) {
    resetPos(jc);
  }

  var ctx = bufferCanvas.getContext('2d');
  ctx.save();
  drawShadow(jc);
  drawCropGride(jc);
  ctx.restore();
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
        drawCropBox(jc);

        jc._renderOffScreen();
      },
      get: function get() {
        return cropperImage;
      }
    });
    loadImage(jc);
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
