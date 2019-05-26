import { typeOf } from '../utils/tool';
import { callHook } from '../lifeCircle';

const toLowerCase = String.prototype.toLowerCase;

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
    const img = jc.img || jc.image;
    if(!img || img === jc._img){
        return ;
    }
    callHook(jc,'beforeImgLoaded');
    if( typeOf(img) === 'string' ){
        const targetImg = new Image();
        targetImg.onload = function(){
            jc._targetImg = targetImg;
            jc._img = img;
        };
        targetImg.onerror = loadFail;
        targetImg.src = img;
    }else if( typeOf(img) === 'object' && toLowerCase.call(img) === 'img' && img.nodeType === 1 ){
        img.onload = function(){
            jc._targetImg = img;
            jc._img = img;
        }
        img.onerror = loadFail;
    }else{
        loadFail();
    }
}

function initImage(jc){
    const targetImg = jc._targetImg;
    const { 
        width: originImgWidth,
        height: originImgHeight
    } = targetImg;
    const {
        cropperWidth,
        cropperHeight,
        _zoom: zoom
    } = jc;

    const width = cropperWidth * zoom;
    const height = cropperHeight * zoom;
    let imgWidth = originImgWidth * zoom;
    let imgHeight = originImgHeight * zoom;

    const radio = Math.max(imgWidth / cropperWidth, imgHeight / cropperHeight);
console.log(imgWidth / cropperWidth, imgHeight / cropperHeight);
    imgWidth = imgWidth / radio;
    imgHeight = imgHeight / radio;

    const imgSource = document.createElement('canvas');
    const ctx = imgSource.getContext('2d');
    imgSource.width = width;
    imgSource.height = height;
    ctx.drawImage(targetImg,0,0,originImgWidth,originImgWidth,0,0,imgWidth,imgHeight);
    document.body.appendChild(imgSource);
}

/* 
 * 向画布中绘制背景图，并保存绘图数据
 */
function drawImage(jc){
    const targetImg = jc._targetImg;
    console.log(targetImg.width,targetImg.height);
}


export {
    loadImage,
    initImage,
    drawImage
};