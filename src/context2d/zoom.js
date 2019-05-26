/* 
 * 根据设备像素比来设置画布缩放
 *
 * @params {CanvasRenderingContext2D} ctx;2d画布绘图对象
 * 
 * @return {Number};返回计算出的画布缩放
 */

function getZoom(ctx){
    const devicePixelRadio = window.devicePixelRatio || 1;
    const backingStore = 
            ctx.backingStorePixelRatio 
            || ctx.webkitBackingStorePixelRadio
            || ctx.mozBackingStorePixelRadio
            || ctx.msBackingStorePixelRadio
            || ctx.oBackingStorePixedRadio
            || 1;
    
    return devicePixelRadio / backingStore;
}

export {
    getZoom
};