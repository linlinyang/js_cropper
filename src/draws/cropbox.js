import {rect} from '../context2d/rect';

/* 
 * 重置裁剪框位置，在画布中间
 */
function resetPos(jc){
    const {
        width,
        height,
        _zoom: zoom,
        cropperWidth,
        cropperHeight
    } = jc;
    
    jc._x = ( cropperWidth - width ) * zoom / 2;
    jc._y = ( cropperHeight - height ) * zoom / 2;
}

/* 
 * 绘制裁剪框与画布之间的阴影
 */
function drawShadow(jc){
    const {
        bufferCanvas,
        cropperWidth,
        cropperHeight,
        width,
        height,
        _x: x,
        _y: y,
        _zoom: zoom,
        isDragging
    } = jc;
    const ctx = bufferCanvas.getContext('2d');

    ctx.save();

    ctx.beginPath();
    rect( ctx, 0, 0, cropperWidth * zoom, cropperHeight * zoom );//顺时针画外框
    rect( ctx, x, y, width * zoom, height * zoom,true );//逆时针画内框
    ctx.fillStyle = isDragging ? jc.selectBackColor : jc.inSelectBackColor;
    ctx.fill();//根据环绕原则，填充颜色

    ctx.restore();
}

function drawCropGride(jc){
    const {
        bufferCanvas,
        cropperWidth,
        cropperHeight,
        width,
        height,
        _x: x,
        _y: y,
        _zoom: zoom
    } = jc;
    const ctx = bufferCanvas.getContext('2d');
    
}

function drawCropBox(jc){
    const {
        bufferCanvas,
        _x: x,
        _y: y
    } = jc;
    if(x === undefined || y === undefined){
        resetPos(jc);
    }

    const ctx = bufferCanvas.getContext('2d');
    ctx.save();

    drawShadow(jc);
    drawCropGride(jc);

    ctx.restore();
}

export {
    drawCropBox,
    resetPos
};