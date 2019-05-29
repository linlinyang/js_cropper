import { off } from './events/listeners';
import { resetPos } from './draws/cropbox';

function callHook(jc,hook){
    const handler = jc[hook];
    typeof handler === 'function' && handler.call(jc);
}

const defaultOptions = {
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
    selectBackColor: 'rgba(0,0,0,0.4)'
};

function lifyCircleMixin(JSCropper){

    JSCropper.prototype.update = function(options){
        const jc = this;
        Object.assign(jc,options);
        jc._redraw();
    };

    JSCropper.prototype.destroy = function(){
        let jc = this;
        callHook(jc,'beforeDestory');

        off();
        jc.canvas = jc.bufferCanvas = jc._sourceImg = jc._originOpts = null;
        callHook(jc,'destoryed');
        jc = null;
    }
    
    JSCropper.prototype.reset = function(){
        const jc = this;
        resetPos(jc);
        jc._redraw();
    };

    JSCropper.prototype.cut = function(){
        const jc = this;
        const {
            _sourceImg: sourceImg,
            _imgWidth: imgWidth,
            _imgHeight: imgHeight,
            _zoom: zoom,
            cropperWidth,
            cropperHeight,
            width: cWidth,
            height: cHeight,
            _x: x,
            _y: y,
            imgType,
            quality
        } = jc;
        const dx = ( cropperWidth * zoom - imgWidth ) / 2;
        const dy = ( cropperHeight * zoom - imgHeight ) / 2;
        const {
            width,
            height
        } = sourceImg;

        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');

        tempCanvas.width = cropperWidth * zoom;
        tempCanvas.height = cropperHeight * zoom;
        tempCanvas.style.width = cropperWidth + 'px';
        tempCanvas.style.height = cropperHeight + 'px';

        ctx.drawImage(sourceImg,0,0,width,height,dx,dy,imgWidth,imgHeight);

        const resultCanvas = document.createElement('canvas');
        const rstCtx = resultCanvas.getContext('2d');
        resultCanvas.width = cWidth * zoom;
        resultCanvas.height = cHeight * zoom;
        resultCanvas.style.width = cWidth + 'px';
        resultCanvas.style.height = cHeight + 'px';
        rstCtx.putImageData(ctx.getImageData(x,y,cWidth * zoom,cHeight * zoom),0,0);

        return resultCanvas.toDataURL(imgType,quality);
    };
    
}

export {
    lifyCircleMixin,
    defaultOptions,
    callHook
};