import { callHook } from './lifeCircle';
import { typeOf } from './utils/tool';

function resizeCanvas(canvas,width,height,zoom = 1){
    const ctx = canvas.getContext('2d');
    const zoomWidth = width * zoom;
    const zoomHeight = height * zoom;

    canvas.width = zoomWidth;
    canvas.height = zoomHeight;

    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    return {
        zoomWidth,
        zoomHeight
    };
}

const toLowerCase = String.prototype.toLowerCase;

/* 
 * 判断一个对象是不是html元素
 * @params {Object} el;待检测的对象
 * 
 * @return Boolean；返回是否是html元素
 */
function isHtmlElement(el){
    return el instanceof HTMLElement;
}

/* 
 * 判断一个对象是不是canvas元素
 * @params {Object} el;待检测的对象
 * 
 * @return Boolean；返回是否是canvas元素
 */
function isCanvas(el){
    return el instanceof HTMLCanvasElement;
}

function canvasMixin(JSCropper){
    /* 
    * 如果用户传递进来的el是画布元素，则使用改画布元素，否则创建之
    * 如果el是html对象，并非画布元素，则将创建画布元素添加到改对象中
     */
    JSCropper.prototype._initCanvas = function(){
        const jc = this;
        
        callHook(jc,'beforeCreate');

        const el = jc.el;
        const $el = typeof el === 'string' ? document.querySelector(el) : isCanvas( el ) && el;

        if($el && toLowerCase.call($el.nodeName) === 'canvas' && $el.nodeType === 1){//传入参数el为画布元素
            jc.canvas = $el;
            jc.debug && console.log('使用传入的canvas元素',$el);
            return ;
        }

        const canvas = document.createElement('canvas');
        canvas.innerHTML = '你的浏览器不支持画布元素';
        jc.debug && console.log('创建一个新的画布元素：',canvas);
        jc.canvas = canvas;

        const wrapEl = typeof el === 'string' 
            ?  document.querySelector(el)
            : isHtmlElement( el ) && el;
            
        if( wrapEl && wrapEl.nodeType === 1 ){
            wrapEl.appendChild(canvas);
            jc.debug && console.wran('将画布添加至el对应的元素,请注意设置样式');
        }
    };

    /* 
    * 重置画布尺寸，设置画布的绘图表面大小和元素大小
     */
    JSCropper.prototype._resizeCanvas = function(){
        const jc = this;
        
        const {
            canvas,
            _zoom: zoom,
            cropperWidth: width,
            cropperHeight: height
        } = jc;

        resizeCanvas(canvas,width,height,zoom);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        jc.debug && console.log(`重置画布大小为: ${width * zoom}*${height * zoom};样式大小为：${width}*${height}px`);
    };

    /* 
    * 创建离屏画布并初始化
     */
    JSCropper.prototype._offscreenBuffering = function(){
        const jc = this;

        const bufferCanvas = jc.bufferCanvas || document.createElement('canvas');
        const bufferCtx = bufferCanvas.getContext('2d');
        const {
            _zoom: zoom,
            cropperWidth: width,
            cropperHeight: height
        } = jc;
        const {
            zoomWidth,
            zoomHeight
        } = resizeCanvas(bufferCanvas,width,height,zoom);//重置尺寸

        bufferCtx.clearRect(0,0,zoomWidth,zoomHeight);
        bufferCtx.save();
        
        bufferCtx.fillStyle = jc.shadowColor;
        bufferCtx.fillRect(0,0,zoomWidth,zoomHeight);//设置默认背景

        bufferCtx.restore();

        !jc.bufferCanvas && (jc.bufferCanvas = bufferCanvas);
    };

    /* 
    * 渲染离屏画布至裁剪画布
     */
    JSCropper.prototype._renderOffScreen = function(){
        const jc = this;
        const {
            bufferCanvas,
            canvas,
            cropperWidth,
            cropperHeight,
            _zoom: zoom
        } = jc;
        const ctx = canvas.getContext('2d');
        const width = cropperWidth * zoom;
        const height = cropperHeight * zoom;
        
        ctx.clearRect(0,0,width,height);
        ctx.drawImage(bufferCanvas,0,0,width,height,0,0,width,height);
    };
}

export {
    canvasMixin
};