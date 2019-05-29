import { typeOf } from '../utils/tool';
import { callHook } from '../lifeCircle';

const toLowerCase = String.prototype.toLowerCase;

/* 
 * 图片加载失败，抛出错误
 */
function loadFail(){
    callHook(jc,'imgLoaded');
    throw new Error('Load image fail, please check your image');
}

/* 
 * 根据配置加载图片
 * 
 * 图片为String类型则作为图片路径处理
 * 图片是Image对象，则直接使用
 * 其他类型抛出错误
 */
function loadImage(jc){
    const img = jc.img;
    if(!img || img === jc._img){
        return ;
    }
    callHook(jc,'beforeImgLoaded');
    if( typeOf(img) === 'string' ){
        const targetImg = new Image();
        targetImg.onload = function(){
            jc._sourceImg = targetImg;
            jc._img = img;
            callHook(jc,'imgLoaded');
        };
        targetImg.onerror = loadFail;
        targetImg.src = img;
    }else if( typeOf(img) === 'object' && toLowerCase.call(img) === 'img' && img.nodeType === 1 ){
        img.onload = function(){
            jc._sourceImg = img;
            jc._img = img;
            callHook(jc,'imgLoaded');
        }
        img.onerror = loadFail;
    }else{
        loadFail();
    }
}

/* 
 * 初始化图片大小，等比缩放至画布大小
 */
function initImage(jc){
    if(!jc._sourceImg){
        return ;
    }
    const {
        cropperWidth,
        cropperHeight,
        _zoom: zoom,
        _sourceImg: {
            width,
            height
        }
    } = jc;
    const ratio = Math.min(cropperWidth / width, cropperHeight / height);
    
    Object.assign(jc,{
        _imgWidth: width * ratio * zoom,
        _imgHeight: height * ratio * zoom
    });
}

/* 
 * 向画布中绘制背景图，并保存绘图数据
 */
function drawImage(jc){
    if(!jc._sourceImg){
        return ;
    }
    initImage(jc);
    const {
        bufferCanvas,
        _sourceImg: sourceImg,
        cropperWidth,
        cropperHeight,
        _imgWidth: imgWidth,
        _imgHeight: imgHeight,
        _zoom: zoom
    } = jc;
    const {
        width,
        height
    } = sourceImg;
    const ctx = bufferCanvas.getContext('2d');
    const dx = ( cropperWidth * zoom - imgWidth ) / 2;
    const dy = ( cropperHeight * zoom - imgHeight ) / 2;

    ctx.clearRect(0,0,cropperWidth * zoom,cropperHeight * zoom);
    ctx.drawImage(sourceImg,0,0,width,height,dx,dy,imgWidth,imgHeight);
}


export {
    loadImage,
    drawImage
};