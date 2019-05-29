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
    selectBackColor: 'rgba(0,0,0,0.4)',
    debug: false
};

function lifyCircleMixin(JSCropper){

    JSCropper.prototype.update = function(options){
        const jc = this;
        jc.debug && console.log('更新参数，重绘裁剪框');
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
        jc.debug && console.log('销毁裁剪框');
    }
    
    JSCropper.prototype.reset = function(){
        const jc = this;
        jc.debug && console.log('重置裁剪框位置在画布中间');
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

        let tempCanvas = document.createElement('canvas');
        let ctx = tempCanvas.getContext('2d');

        tempCanvas.width = cropperWidth * zoom;
        tempCanvas.height = cropperHeight * zoom;
        tempCanvas.style.width = cropperWidth + 'px';
        tempCanvas.style.height = cropperHeight + 'px';

        ctx.drawImage(sourceImg,0,0,width,height,dx,dy,imgWidth,imgHeight);

        const resultCanvas = document.createElement('canvas');
        let rstCtx = resultCanvas.getContext('2d');
        resultCanvas.width = cWidth * zoom;
        resultCanvas.height = cHeight * zoom;
        resultCanvas.style.width = cWidth + 'px';
        resultCanvas.style.height = cHeight + 'px';
        rstCtx.putImageData(ctx.getImageData(x,y,cWidth * zoom,cHeight * zoom),0,0);

        tempCanvas = ctx = rstCtx = null;
        jc.debug && console.warn('裁剪base64格式的图片，图片大小会受设备像素比影响，请注意设置图片尺寸');
        return resultCanvas.toDataURL(imgType,quality);
    };
    
}

export {
    lifyCircleMixin,
    defaultOptions,
    callHook
};