import { loadImage,drawImage } from './draws/imgUtil';
import { getZoom } from './utils/tool';
import { drawCropBox } from './draws/cropbox';
import { callHook } from './lifeCircle';

function drawMixin(JSCropper){

    let cropperImage = null;
    
    /* 
    * 异步图片加载，加载完成后重绘画布
     */
    JSCropper.prototype._observeImg = function(){
        const jc = this;

        Object.defineProperty( jc, '_img', {
            set(newVal){
                if(newVal === cropperImage){
                    return ;
                }
                
                cropperImage = newVal;
                jc._redraw();
            },
            get(){
                return cropperImage
            }
        });
    };

    /* 
    * 重新绘制裁剪画布
     */
    JSCropper.prototype._redraw = function(){
        const jc = this;
        jc._zoom = getZoom();//初始化缩放比例
        jc._resizeCanvas();//根据比例初始化画布尺寸
        jc._offscreenBuffering(jc);//初始化离屏画布
        loadImage(jc);//加载图片
        drawImage(jc);//图片绘制在离屏画布上
        drawCropBox(jc);//绘制裁剪框在离屏画布上
        jc._renderOffScreen();//离屏画布渲染到裁剪画布上
        callHook(jc,'onUpdate');
    };
}

export {
    drawMixin
};