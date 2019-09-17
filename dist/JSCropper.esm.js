/* !
  * JSCropper v2.0.0
  * https://github.com/linlinyang/js_cropper.git
  * 
  * (c) 2019 Yang Lin
  */

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

/* /src/core/instance/wrapper */
function initWrapper(jc) {
  var el = jc.el;
  var cropperWidth = jc.cropperWidth;
  var cropperHeight = jc.cropperHeight;
}

function error(msg) {
  throw new Error("JSCropper Error: " + msg);
}
function log(msg) {
  console.log("JSCroppe: " + msg);
}

var defaultOptions = {
  el: {
    type: [String, Object],
    required: true
  },
  cropperWidth: {
    // 裁剪屏宽度
    type: Number,
    "default": 800
  },
  cropperHeight: {
    // 裁剪屏高度
    type: Number,
    "default": 600
  },
  width: {
    // 裁剪框宽度
    type: Number,
    "default": 300
  },
  height: {
    // 裁剪框高度
    type: Number,
    "default": 300
  },
  showCropperBox: {
    // 是否绘制裁剪框
    type: Boolean,
    "default": true
  },
  edgeLineColor: {
    // 裁剪框边线颜色
    type: String,
    "default": '#fff'
  },
  edgeLineWidth: {
    // 裁剪框边线线宽
    type: Number,
    "default": 3
  },
  inSelecShadowColor: {
    // 未拖拽裁剪框时裁剪框时裁剪框外阴影颜色
    type: String,
    "default": 'rgba(0,0,0,0.6)'
  },
  selectShadowColor: {
    // 拖拽裁剪框时裁剪框外阴影颜色
    type: String,
    "default": 'rgba(0,0,0,0.4)'
  },
  showDashLine: {
    // 是否显示裁剪框中间虚线
    type: Boolean,
    defualt: true
  },
  dashLineColor: {
    // 裁剪框中间虚线颜色
    type: String,
    "default": 'rgba(255,255,255,0.8)'
  },
  dashLineWidth: {
    // 虚线宽度
    type: Number,
    "default": 3
  },
  backColor: {
    // 画布背景色
    type: String,
    defualt: 'rgba(0,0,0,0.7)'
  },
  imgType: {
    // 裁剪结果的图片类型
    type: String,
    "default": 'image/png'
  },
  quality: {
    // 裁剪结果的图片质量
    type: Number,
    validator: function validator(val) {
      return val >= 0 && val <= 1;
    },
    "default": 1
  },
  rotateDeg: {
    //旋转角度
    type: Number,
    "default": 0
  },
  scale: {
    // 缩放
    type: Array,
    "default": [1, 1]
  },
  debug: {
    // 是否显示调试信息
    type: Boolean,
    "default": false
  }
};
function mergeOptions(options) {
  var ret = {};
  Object.keys(defaultOptions).forEach(function (key) {
    var value = options[key];
    var ref = defaultOptions[key];
    var type = ref.type;
    var validator = ref.validator;
    var defaultVal = ref["default"];
    var required = ref.required;

    if (!!required && value === undefined) {
      //check required
      error("Missing required prop " + key + ".");
    }

    if (value !== undefined) {
      if (type) {
        var types = Array.isArray(type) ? type : [type];
        var pass = false;
        var nameStr = types.reduce(function (name, typeConstructor) {
          pass = pass || typeOf(value) === getType(typeConstructor).toLowerCase();
          return name += typeConstructor.name + " or";
        }, '');
        !pass && error("Expect " + key + "'s value is " + nameStr.substring(0, nameStr.length - 3) + " type.");
      }

      if (validator && !validator(value)) {
        error("Invalid " + key + ",custom validator check failed for " + key);
      }
    }

    ret[key] = value === undefined ? defaultVal : value;
  });
  return ret;
}

function getType(constructor) {
  var match = constructor && constructor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : '';
}

/* /src/core/instance/lifecycls.js */
function callhook(jc, hook) {
  var handler = jc[hook];

  if (handler && typeOf(handler) === 'function') {
    handler.call(jc);
  }
}

/* /src/core/instance/updateMixin */
function initMixin(JSCropper) {
  var uid = 1;

  JSCropper.prototype._init = function (options) {
    var jc = this;
    Object.assign(jc, mergeOptions(options));
    jc._uid = uid++;
    jc.debug && log('before create');
    callhook('breforeCreate');
    initWrapper(jc);
    return jc;
  };

  JSCropper.prototype.update = function (options) {
    return this._init(options);
  };
}

/* /src/core/instance/index.js */

var JSCropper = function JSCropper(options) {
  this._init(options);
};

initMixin(JSCropper);

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

export default JSCropper;
