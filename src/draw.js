import { loadImage,initImage,drawImage } from './draws/imgUtil';
import { getZoom } from './utils/tool';
import { drawCropBox } from './draws/cropbox';

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
                drawCropBox(jc);
                jc._renderOffScreen();
            },
            get(){
                return cropperImage
            }
        });
        loadImage(jc);
    };
}

export {
    drawMixin
};