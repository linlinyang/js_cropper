/* /src/init.js */
import { callHook } from './lifeCircle';

let uid = 1;
function initMixin(JSCropper){
    JSCropper.prototype._init = function(options){
        const jc = this;

        jc._originOpts = options;
        Object.assign( jc, {
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
        
        jc._initCanvas();
        jc._redraw();

        callHook(jc,'created');
    };
}

export {
    initMixin
};