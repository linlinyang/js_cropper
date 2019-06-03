/* !
  * JSCropper v1.1.2
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
        '[object Null]': 'null'
      };
      return map[type];
    }
    /* 
     *计算两点之间的距离
     *
     * @params {Number} sx;起点x坐标
     * @params {Number} sy;起点y坐标
     * @params {Number} dx;终点x坐标
     * @params {Number} dy;终点y坐标
     * 
     * @return {Number} 返回两点间直线距离
     */


    function distance(sx, sy, dx, dy) {
      return Math.sqrt(Math.pow(dx - sx, 2) + Math.pow(dy - sy, 2));
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
    /* 
     * 页面坐标转换为画布内坐标
     * @params {HTMLCanvasElement} canvas,画布元素
     * @params {Number} x,window坐标，距离屏幕左边框水平距离
     * @params {Number} y,window坐标，距离屏幕上边框垂直距离
     * 
     * @return {Object};返回坐标点在画布元素内的坐标
     */


    function window2canvas(canvas, x, y) {
      var width = canvas.width;
      var height = canvas.height;
      var ref = canvas.getBoundingClientRect();
      var wWidth = ref.width;
      var wHeight = ref.height;
      var wX = ref.left;
      var wY = ref.top;
      return {
        x: (x - wX) * (width / wWidth),
        y: (y - wY) * (height / wHeight)
      };
    }

    function toFileSize(length) {
      var bit = parseInt(length - length / 8 * 2);
      var units = ['Bit', 'KB', 'MB', 'GB', 'TB'];
      var len = units.length;

      for (var i = 0; i < len; i++) {
        if (bit >> 10 * i < 1024) {
          return (bit / 1024).toFixed(1) + units[i];
        }
      }

      return 'too large';
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

    var cacheEvents = [];

    function on(el, type, handler, options) {
      if (options === void 0) options = false;
      el.addEventListener(type, handler, options);
      cacheEvents.push({
        el: el,
        type: type,
        handler: handler,
        options: options
      });
    }

    function off(el, type, handler, options) {
      if (options === void 0) options = false;
      var len = cacheEvents.length;
      var rmIndexs = [];

      while (len--) {
        var ref = cacheEvents[len];
        var cacheEl = ref.el;
        var cacheType = ref.type;
        var cacheHandler = ref.handler;
        var cacheOptions = ref.options;

        if (!el || el === cacheEl && type === undefined || handler === undefined && type === cacheType && el === cacheEl || options === undefined && type === cacheType && handler === cacheHandler && el === cacheEl || type === cacheType && handler === cacheHandler && options === cacheOptions && el === cacheEl) {
          rmIndexs.push(len);
          cacheEl.removeEventListener(cacheType, cacheHandler, cacheOptions);
        }
      }

      rmIndexs.forEach(function (val) {
        cacheEvents.splice(val, 1);
      });
    }

    function getEvent(e) {
      return e.changedTouches ? e.changedTouches[0] : e;
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
     * 移动绘图路径起点
     *
     * @params {CanvasRenderingContext2D} ctx;2d画布绘图对象
     * @params {Number} x;起点x坐标
     * @params {Number} y;起点y坐标
     * @params {Boolean} isSolid;是否需要转换为实线
     */


    function moveTo(ctx, x, y, isSolid) {
      if (isSolid === void 0) isSolid = false;
      var lineWidth = ctx.lineWidth;

      if (isSolid) {
        ctx.moveTo(convertNum(x, lineWidth), convertNum(y, lineWidth));
      } else {
        ctx.moveTo(x, y);
      }
    }
    /* 
     * 绘制1px线段，canvas绘制1px线条bug，需要转换0.5px
     *
     * @params {CanvasRenderingContext2D} ctx;2d画布绘图对象
     * @params {Number} x;线段终点x坐标
     * @params {Number} y;线段终点y坐标
     * @params {Boolean} isSolid;是否需要转换为实线
     */


    function lineTo(ctx, x, y, isSolid) {
      if (isSolid === void 0) isSolid = false;
      var lineWidth = ctx.lineWidth;

      if (isSolid) {
        ctx.lineTo(convertNum(x, lineWidth), convertNum(y, lineWidth));
      } else {
        ctx.lineTo(x, y);
      }
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
      } else {
        //逆时针
        ctx.moveTo(x, y);
        ctx.lineTo(x, yDistance);
        ctx.lineTo(xDistance, yDistance);
        ctx.lineTo(xDistance, y);
      }

      ctx.closePath();
    }
    /* 
     * 虚线绘制，从起点绘制一条至终点的虚线
     *
     * @params {CanvasRenderingContext2D} ctx;2d画布绘图对象
     * @params {Number} sx; 起点x坐标
     * @params {Number} sy;起点y坐标
     * @params {Number} dx;终点x坐标
     * @params {Number} dy;终点y坐标
     * @params {Number} step;虚线长度
     */


    function dashLine(ctx, sx, sy, dx, dy, step, isSolid) {
      if (step === void 0) step = 5;
      if (isSolid === void 0) isSolid = false;
      var length = distance(sx, sy, dx, dy);
      var dotNums = Math.floor(length / step);
      var xStep = (dx - sx) / dotNums;
      var yStep = (dy - sy) / dotNums;

      for (var i = 0; i < dotNums; i++) {
        var x = sx + i * xStep;
        var y = sy + i * yStep;
        i & 1 ? lineTo(ctx, x, y, isSolid) : moveTo(ctx, x, y, isSolid);
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
      ctx.fill(); //根据环绕原则，填充镂空阴影颜色

      ctx.restore();
    }
    /* 
    * 绘制裁剪框表格，裁剪框边框以及中间虚线
     */


    function drawCropGride(jc) {
      var bufferCanvas = jc.bufferCanvas;
      var width = jc.width;
      var height = jc.height;
      var x = jc._x;
      var y = jc._y;
      var zoom = jc._zoom;
      var edgeLineColor = jc.edgeLineColor;
      var edgeLineWidth = jc.edgeLineWidth;
      var ctx = bufferCanvas.getContext('2d');
      var w = width * zoom;
      var h = height * zoom;
      ctx.strokeStyle = edgeLineColor;
      /* 
      * 绘制裁框边线、中间虚线
      */

      ctx.save();
      ctx.lineWidth = Math.pow(zoom, 2);
      rect(ctx, x, y, w, h, false, true);
      dashLine(ctx, x, y + h / 3, x + w, y + h / 3, 5 * zoom, true); //水平第一条虚线

      dashLine(ctx, x, y + h * 2 / 3, x + w, y + h * 2 / 3, 5 * zoom, true); //水平第一条虚线

      dashLine(ctx, x + w / 3, y, x + w / 3, y + h, 5 * zoom, true); //垂直第一条虚线

      dashLine(ctx, x + w * 2 / 3, y, x + w * 2 / 3, y + h, 5 * zoom, true); //垂直第一条虚线

      ctx.stroke();
      ctx.restore();
      /* 绘制裁剪框四角边线线 */

      ctx.save();
      var edgeWidth = edgeLineWidth * zoom;
      ctx.lineWidth = edgeWidth;
      var outX = x - edgeWidth / 2;
      var outY = y - edgeWidth / 2 + 1;
      var distanceX = x + w + edgeWidth / 2;
      var distanceY = y + h + edgeWidth / 2;
      var edgeLen = Math.min(w, h) * 0.1;
      ctx.beginPath();
      moveTo(ctx, outX, outY, true); //左上水平边线

      lineTo(ctx, outX + edgeLen, outY, true);
      moveTo(ctx, distanceX - edgeLen, outY, true); //右上水平边线

      lineTo(ctx, distanceX, outY, true);
      lineTo(ctx, distanceX, outY + edgeLen, true); //右上垂直线

      moveTo(ctx, distanceX, distanceY - edgeLen, true); //右下垂直线

      lineTo(ctx, distanceX, distanceY, true);
      lineTo(ctx, distanceX - edgeLen, distanceY, true); //右下水平线

      moveTo(ctx, outX + edgeLen, distanceY, true); //左下水平线

      lineTo(ctx, outX, distanceY, true);
      lineTo(ctx, outX + 1, distanceY - edgeLen, true); //左下垂直线

      moveTo(ctx, outX + 1, outY + edgeLen, true); //左上垂直线

      lineTo(ctx, outX + 1, outY - edgeWidth / 2, true);
      ctx.stroke();
      ctx.restore();
    }
    /* 
    * 绘制裁剪框
     */


    function drawCropBox(jc, isForce) {
      var bufferCanvas = jc.bufferCanvas;
      var x = jc._x;
      var y = jc._y;
      isForce && resetPos(jc);
      var ctx = bufferCanvas.getContext('2d');
      ctx.save();
      drawShadow(jc);
      drawCropGride(jc);
      ctx.restore();
    }

    function callHook(jc, hook) {
      var handler = jc[hook];
      typeof handler === 'function' && handler.call(jc);
    }

    var defaultOptions = {
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
      debug: false
    };

    function lifyCircleMixin(JSCropper) {
      JSCropper.prototype.update = function (options) {
        var jc = this;
        jc.debug && console.log('更新参数，重绘裁剪框');
        Object.assign(jc, options);

        jc._redraw(true);
      };

      JSCropper.prototype.destroy = function () {
        var jc = this;
        callHook(jc, 'beforeDestory');
        off();
        jc.canvas = jc.bufferCanvas = jc._sourceImg = jc._originOpts = null;
        callHook(jc, 'destoryed');
        jc.debug && console.log('销毁裁剪框');
        jc = null;
      };

      JSCropper.prototype.reset = function () {
        var jc = this;
        jc.debug && console.log('重置裁剪框位置在画布中间');
        resetPos(jc);

        jc._redraw();
      };

      JSCropper.prototype.cut = function () {
        var jc = this;
        var sourceImg = jc._sourceImg;
        var imgWidth = jc._imgWidth;
        var imgHeight = jc._imgHeight;
        var zoom = jc._zoom;
        var cropperWidth = jc.cropperWidth;
        var cropperHeight = jc.cropperHeight;
        var cWidth = jc.width;
        var cHeight = jc.height;
        var x = jc._x;
        var y = jc._y;
        var imgType = jc.imgType;
        var quality = jc.quality;
        var dx = (cropperWidth * zoom - imgWidth) / 2;
        var dy = (cropperHeight * zoom - imgHeight) / 2;
        var width = sourceImg.width;
        var height = sourceImg.height;
        var tempCanvas = document.createElement('canvas');
        var ctx = tempCanvas.getContext('2d');
        tempCanvas.width = cropperWidth * zoom;
        tempCanvas.height = cropperHeight * zoom;
        tempCanvas.style.width = cropperWidth + 'px';
        tempCanvas.style.height = cropperHeight + 'px';
        ctx.drawImage(sourceImg, 0, 0, width, height, dx, dy, imgWidth, imgHeight);
        var resultCanvas = document.createElement('canvas');
        var rstCtx = resultCanvas.getContext('2d');
        resultCanvas.width = cWidth * zoom;
        resultCanvas.height = cHeight * zoom;
        resultCanvas.style.width = cWidth + 'px';
        resultCanvas.style.height = cHeight + 'px';
        rstCtx.putImageData(ctx.getImageData(x, y, cWidth * zoom, cHeight * zoom), 0, 0);
        tempCanvas = ctx = rstCtx = null;
        jc.debug && console.warn('裁剪base64格式的图片，图片大小会受设备像素比影响，请注意设置图片尺寸');
        var ret = resultCanvas.toDataURL(imgType, quality);

        if (jc.debug) {
          var retStr = ret.replace("data:" + jc.imgType + ";base64,", '');
          console.log("获得的裁剪图片尺寸：" + toFileSize(retStr.length));
          console.log("裁剪图片大小：" + cWidth * zoom + "×" + cHeight * zoom + "像素");
        }

        return ret;
      };
    }

    /* /src/init.js */
    var uid = 1;

    function initMixin(JSCropper) {
      /* 
      * 合并参数，初始化画布，加载图片并绘制裁剪框
       */
      JSCropper.prototype._init = function (options) {
        var jc = this;
        jc._originOpts = options;
        Object.assign(jc, defaultOptions, options);
        jc._uid = uid++;
        jc.debug && console.log('开始构建裁剪...');

        jc._initCanvas();

        jc._observeImg();

        jc._redraw(true);

        jc._bindDrag();

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

    var toLowerCase = String.prototype.toLowerCase;
    /* 
     * 判断一个对象是不是html元素
     * @params {Object} el;待检测的对象
     * 
     * @return Boolean；返回是否是html元素
     */

    function isHtmlElement(el) {
      return el instanceof HTMLElement;
    }
    /* 
     * 判断一个对象是不是canvas元素
     * @params {Object} el;待检测的对象
     * 
     * @return Boolean；返回是否是canvas元素
     */


    function isCanvas(el) {
      return el instanceof HTMLCanvasElement;
    }

    function canvasMixin(JSCropper) {
      /* 
      * 如果用户传递进来的el是画布元素，则使用改画布元素，否则创建之
      * 如果el是html对象，并非画布元素，则将创建画布元素添加到改对象中
       */
      JSCropper.prototype._initCanvas = function () {
        var jc = this;
        callHook(jc, 'beforeCreate');
        var el = jc.el;
        var $el = typeof el === 'string' ? document.querySelector(el) : isCanvas(el) && el;

        if ($el && toLowerCase.call($el.nodeName) === 'canvas' && $el.nodeType === 1) {
          //传入参数el为画布元素
          jc.canvas = $el;
          jc.debug && console.log('使用传入的canvas元素', $el);
          return;
        }

        var canvas = document.createElement('canvas');
        canvas.innerHTML = '你的浏览器不支持画布元素';
        jc.debug && console.log('创建一个新的画布元素：', canvas);
        jc.canvas = canvas;
        var wrapEl = typeof el === 'string' ? document.querySelector(el) : isHtmlElement(el) && el;

        if (wrapEl && wrapEl.nodeType === 1) {
          wrapEl.appendChild(canvas);
          jc.debug && console.wran('将画布添加至el对应的元素,请注意设置样式');
        }
      };
      /* 
      * 重置画布尺寸，设置画布的绘图表面大小和元素大小
       */


      JSCropper.prototype._resizeCanvas = function () {
        var jc = this;
        var canvas = jc.canvas;
        var zoom = jc._zoom;
        var width = jc.cropperWidth;
        var height = jc.cropperHeight;
        resizeCanvas(canvas, width, height, zoom);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        jc.debug && console.log("重置画布大小为: " + width * zoom + "*" + height * zoom + ";样式大小为：" + width + "*" + height + "px");
      };
      /* 
      * 创建离屏画布并初始化
       */


      JSCropper.prototype._offscreenBuffering = function () {
        var jc = this;
        var bufferCanvas = jc.bufferCanvas || document.createElement('canvas');
        var bufferCtx = bufferCanvas.getContext('2d');
        var zoom = jc._zoom;
        var width = jc.cropperWidth;
        var height = jc.cropperHeight;
        var ref = resizeCanvas(bufferCanvas, width, height, zoom);
        var zoomWidth = ref.zoomWidth;
        var zoomHeight = ref.zoomHeight; //重置尺寸

        bufferCtx.clearRect(0, 0, zoomWidth, zoomHeight);
        bufferCtx.save();
        bufferCtx.fillStyle = jc.shadowColor;
        bufferCtx.fillRect(0, 0, zoomWidth, zoomHeight); //设置默认背景

        bufferCtx.restore();
        !jc.bufferCanvas && (jc.bufferCanvas = bufferCanvas);
      };
      /* 
      * 渲染离屏画布至裁剪画布
       */


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

    /* 
     * 判断坐标点是否在裁剪框之内
     */

    function inCropBox(jc, x, y) {
      var canvas = jc.canvas;
      var zoom = jc._zoom;
      var width = jc.width;
      var height = jc.height;
      var cx = jc._x;
      var cy = jc._y;

      if (x > cx && x < cx + width * zoom && y > cy && y < cy + height * zoom) {
        //在裁剪框之内
        canvas.style.cursor = 'move';
        return true;
      } else {
        //不在裁剪框之内
        canvas.style.cursor = 'default';
        return false;
      }
    }
    /* 
     * 鼠标或者touchstart回调，设置当前点击点距离裁剪框当前距离
     */


    function down(jc) {
      return function (e) {
        var event = getEvent(e);
        var canvas = jc.canvas;
        var cx = jc._x;
        var cy = jc._y;
        var ref = window2canvas(canvas, event.clientX, event.clientY);
        var x = ref.x;
        var y = ref.y;
        Object.assign(jc, {
          isDragging: inCropBox(jc, x, y),
          _disX: x - cx,
          _disY: y - cy
        });
      };
    }
    /* 
     * 设置裁剪框坐标，重绘画布
     */


    function move(jc) {
      return function (e) {
        var event = getEvent(e);
        var canvas = jc.canvas;
        var width = jc.width;
        var height = jc.height;
        var cropperWidth = jc.cropperWidth;
        var cropperHeight = jc.cropperHeight;
        var zoom = jc._zoom;
        var isDragging = jc.isDragging;
        var disX = jc._disX;
        var disY = jc._disY;
        var ref = window2canvas(canvas, event.clientX, event.clientY);
        var x = ref.x;
        var y = ref.y;
        var limitX = (cropperWidth - width) * zoom; //x坐标不超出图片右边

        var limitY = (cropperHeight - height) * zoom; //x欧标不超出图片下边

        inCropBox(jc, x, y);

        if (isDragging) {
          jc._x = Math.max(0, Math.min(limitX, x - disX));
          jc._y = Math.max(0, Math.min(limitY, y - disY));

          jc._redraw();

          jc.debug && console.log("拖动裁剪框：(X: " + jc._x + ", Y: " + jc._y + ")");
        }
      };
    }
    /* 
     * 放弃拖拽，重绘画布
     */


    function up(jc) {
      return function (e) {
        jc.isDragging = false;

        jc._redraw();
      };
    }

    function eventMixin(JSCropper) {
      JSCropper.prototype._bindDrag = function () {
        var jc = this;
        on(window, 'mousedown', down(jc), false);
        on(window, 'mousemove', move(jc), false);
        on(window, 'mouseup', up(jc), false);
        on(window, 'touchstart', down(jc), false);
        on(window, 'touchmove', move(jc), false);
        on(window, 'touchend', up(jc), false);
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
      var img = jc.img;

      if (!img || img === jc._img) {
        return;
      }

      callHook(jc, 'beforeImgLoaded');

      if (typeOf(img) === 'string') {
        var targetImg = new Image();

        targetImg.onload = function () {
          jc._sourceImg = targetImg;
          jc._img = img;
          callHook(jc, 'imgLoaded');
        };

        targetImg.crossOrigin = 'Anonymous';
        targetImg.onerror = loadFail;
        targetImg.src = img;
      } else if (typeOf(img) === 'object' && toLowerCase$1.call(img) === 'img' && img.nodeType === 1) {
        img.onload = function () {
          jc._sourceImg = img;
          jc._img = img;
          callHook(jc, 'imgLoaded');
        };

        img.crossOrigin = 'Anonymous';
        img.onerror = loadFail;
      } else {
        loadFail();
      }
    }
    /* 
     * 初始化图片大小，等比缩放至画布大小
     */


    function initImage(jc) {
      if (!jc._sourceImg) {
        return;
      }

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
      if (!jc._sourceImg) {
        return;
      }

      initImage(jc);
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
      ctx.clearRect(0, 0, cropperWidth * zoom, cropperHeight * zoom);
      ctx.drawImage(sourceImg, 0, 0, width, height, dx, dy, imgWidth, imgHeight);
    }

    function drawMixin(JSCropper) {
      var cropperImage = null;
      /* 
      * 异步图片加载，加载完成后重绘画布
       */

      JSCropper.prototype._observeImg = function () {
        var jc = this;
        Object.defineProperty(jc, '_img', {
          set: function set(newVal) {
            if (newVal === cropperImage) {
              return;
            }

            cropperImage = newVal;

            jc._redraw();
          },
          get: function get() {
            return cropperImage;
          }
        });
      };
      /* 
      * 重新绘制裁剪画布
       */


      JSCropper.prototype._redraw = function (isForce) {
        if (isForce === void 0) isForce = false;
        var jc = this;

        if (isForce) {
          jc._zoom = getZoom(); //初始化缩放比例

          jc._resizeCanvas(); //根据比例初始化画布尺寸


          jc._offscreenBuffering(jc); //初始化离屏画布

        }

        loadImage(jc); //加载图片

        drawImage(jc); //图片绘制在离屏画布上

        drawCropBox(jc, isForce); //绘制裁剪框在离屏画布上

        jc._renderOffScreen(); //离屏画布渲染到裁剪画布上


        callHook(jc, 'onUpdate');
      };
    }

    /* /src/index.js */

    var JSCropper = function JSCropper(options) {
      this._init(options);
    };

    initMixin(JSCropper);
    lifyCircleMixin(JSCropper);
    canvasMixin(JSCropper);
    eventMixin(JSCropper);
    drawMixin(JSCropper);
    JSCropper.version = '1.1.2';

    return JSCropper;

}));
