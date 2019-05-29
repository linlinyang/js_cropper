/* /src/init.js */
import { callHook,defaultOptions } from './lifeCircle';

let uid = 1;
function initMixin(JSCropper){
    JSCropper.prototype._init = function(options){
        const jc = this;

        jc._originOpts = options;
        Object.assign( jc, defaultOptions, options);
        jc._uid = uid++;
        
        jc._initCanvas();
        jc._observeImg();
        jc._redraw();
        jc._bindDrag();

        callHook(jc,'created');
    };
}

export {
    initMixin
};