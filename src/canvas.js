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

function canvasMixin(JSCropper){
    JSCropper.prototype._restore = function(){
        const jc = this;
        const ctx = jc.ctx;
        const width = jc.cropperWidth * jc._zoom;
        const height = jc.cropperHeight * jc._zoom;

        jc._imageSource = ctx.getImageData(0,0,width,height);
    };

    JSCropper.prototype._initCanvas = function(){
        const jc = this;
        
        callHook(jc,'beforeCreate');
        const el = jc.el;
        let canvas;

        if( typeOf( el ) === 'string' ){
            canvas = document.querySelector(el);
        }else if( typeOf( el ) === 'object' && toLowerCase.call(el.nodeName) === 'canvas' && el.nodeType === 1 ){
            canvas = el;
        }

        if(!canvas){
            canvas = document.createElement('canvas');
            canvas.innerHTML = 'Your browser does not support canvas';
        }
        
        const {
            _zoom: zoom,
            cropperWidth: width,
            cropperHeight: height
        } = jc;

        resizeCanvas(canvas,width,height,zoom);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        !canvas.parentNode && document.body.appendChild(canvas);
        jc.canvas = canvas;
    };

    JSCropper.prototype._offscreenBuffering = function(){
        const jc = this;

        const bufferCanvas = document.createElement('canvas');
        const bufferCtx = bufferCanvas.getContext('2d');
        const {
            _zoom: zoom,
            cropperWidth: width,
            cropperHeight: height
        } = jc;
        const {
            zoomWidth,
            zoomHeight
        } = resizeCanvas(bufferCanvas,width,height,zoom);

        bufferCtx.clearRect(0,0,zoomWidth,zoomHeight);
        bufferCtx.save();
        
        bufferCtx.fillStyle = jc.shadowColor;
        bufferCtx.fillRect(0,0,zoomWidth,zoomHeight);

        bufferCtx.restore();

        jc.bufferCanvas = bufferCanvas;

        document.body.appendChild(bufferCanvas);
    };

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