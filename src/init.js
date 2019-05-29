/* /src/init.js */
import { callHook,defaultOptions } from './lifeCircle';

let uid = 1;
function initMixin(JSCropper){
    /* 
    * 合并参数，初始化画布，加载图片并绘制裁剪框
     */
    JSCropper.prototype._init = function(options){
        const jc = this;

        jc._originOpts = options;
        Object.assign( jc, defaultOptions, options);
        jc._uid = uid++;
        
        jc.debug && console.log('开始构建裁剪...');

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