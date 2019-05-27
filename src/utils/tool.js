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

function convertNum(num){
    return Math.floor(num) + 0.5;
}

export {
    typeOf,
    distance,
    getZoom,
    convertNum
};