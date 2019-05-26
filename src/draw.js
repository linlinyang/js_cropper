import { loadImage,initImage,drawImage } from './draws/imgUtil';
import { getZoom } from './utils/tool';

function drawMixin(JSCropper){

    let cropperImage = null;
    JSCropper.prototype._redraw = function(){
        const jc = this;
        jc._zoom = getZoom();
        jc._initCanvas();
        jc._offscreenBuffering(jc);

        Object.defineProperty( jc, '_img', {
            set(newVal){
                if(newVal === cropperImage){
                    return ;
                }
                
                jc._img = cropperImage = newVal;
                initImage(jc);
                drawImage(jc);
            },
            get(){
                return cropperImage
            }
        });
        loadImage(jc);
    };


    JSCropper.prototype.update = function(options){
        const jc = this;
        callHook(jc,'beforeUpdate');
        if( Object.keys(options) === 0 ){
            return ;
        }
        Object.assign(jc,options);
        jc._redraw();
        callHook(jc,'updated');
    };

    JSCropper.prototype.reset = function(){
        callHook(this,'beforeReset');
    };

}

export {
    drawMixin
};