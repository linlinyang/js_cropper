/* 
 * 工具方法
 */

const toString = Object.prototype.toString;

/* 
 * 返回数据类型
 *
 * @params {any} any;要检测的js基本数据类型
 * 
 * @return {String};返回待检测数据类型
 */
function typeOf(any){
    const type = toString.call(any);
    const map = {
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
function distance(sx,sy,dx,dy){
    return Math.sqrt( Math.pow( dx - sx, 2 ) + Math.pow( dy - sy, 2 ) );
}

/* 
 * 根据设备像素比来设置画布缩放
 *
 * @params {CanvasRenderingContext2D} ctx;2d画布绘图对象
 * 
 * @return {Number};返回计算出的画布缩放
 */

function getZoom(){
    let canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const devicePixelRadio = window.devicePixelRatio || 1;
    const backingStore = 
            ctx.backingStorePixelRatio 
            || ctx.webkitBackingStorePixelRadio
            || ctx.mozBackingStorePixelRadio
            || ctx.msBackingStorePixelRadio
            || ctx.oBackingStorePixedRadio
            || 1;
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
function window2canvas(canvas,x,y){
    const {
        width,
        height
    } = canvas;
    const {
        width: wWidth,
        height: wHeight,
        left: wX,
        top: wY
    } = canvas.getBoundingClientRect();

    return {
        x: (x - wX) * (width / wWidth),
        y: (y - wY) * (height / wHeight)
    };
}

function toFileSize(length){
    const bit = parseInt(length - (length / 8) * 2);
    const units = ['Bit','KB','MB','GB','TB'];
    const len = units.length;

    for(let i = 0; i < len; i++){
        if((bit >> (10 * i)) < 1024){
            return (bit / 1024).toFixed(1) + units[i];
        }
    }

    return 'too large';
}

export {
    typeOf,
    distance,
    getZoom,
    window2canvas,
    toFileSize
};