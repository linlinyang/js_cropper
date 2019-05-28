import {
    rect,
    dashLine, 
    lineTo,
    moveTo
} from '../context2d/lines';

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
        width,
        height,
        _x: x,
        _y: y,
        _zoom: zoom,
        edgeLineColor,
        edgeLineWidth
    } = jc;
    const ctx = bufferCanvas.getContext('2d');
    const w = width * zoom;
    const h = height * zoom;
    ctx.strokeStyle = edgeLineColor;
    
    /* 
    * 绘制裁框边线、中间虚线
    */
    ctx.save();
    ctx.lineWidth = Math.pow(zoom,2);
    rect( ctx, x, y,w, h, false, true );
    dashLine( ctx, x, y + h / 3, x + w, y + h /3, 5 * zoom, true);//水平第一条虚线
    dashLine( ctx, x, y + h * 2 / 3, x + w, y + h * 2 /3, 5 * zoom, true);//水平第一条虚线
    dashLine( ctx, x + w / 3, y, x + w / 3, y + h, 5 * zoom, true );//垂直第一条虚线
    dashLine( ctx, x + w * 2 / 3, y, x + w * 2 / 3, y + h, 5 * zoom, true );//垂直第一条虚线
    ctx.stroke();
    ctx.restore();

    /* 绘制裁剪框四角边线线 */

    ctx.save();
    const edgeWidth = edgeLineWidth * zoom;
    ctx.lineWidth = edgeWidth;
    const outX = x - edgeWidth / 2;
    const outY = y - edgeWidth / 2 + 1;
    const distanceX = x + w + edgeWidth / 2;
    const distanceY = y + h + edgeWidth / 2;
    const edgeLen = Math.min( w, h ) * 0.1;
    
    ctx.beginPath();
    moveTo( ctx, outX, outY, true);//左上水平边线
    lineTo( ctx, outX + edgeLen,outY, true);

    moveTo( ctx, distanceX - edgeLen, outY,true);//右上水平边线
    lineTo( ctx, distanceX, outY, true );
    
    lineTo( ctx, distanceX, outY + edgeLen, true );//右上垂直线

    moveTo( ctx, distanceX, distanceY - edgeLen, true );//右下垂直线
    lineTo( ctx, distanceX, distanceY, true );

    lineTo( ctx, distanceX - edgeLen, distanceY, true );//右下水平线
    
    moveTo( ctx, outX + edgeLen, distanceY, true );//左下水平线
    lineTo( ctx, outX, distanceY, true );

    lineTo( ctx, outX + 1, distanceY - edgeLen, true );//左下垂直线

    moveTo( ctx, outX + 1, outY + edgeLen, true );//左上垂直线
    lineTo( ctx, outX + 1, outY - edgeWidth / 2, true );

    ctx.stroke();
    ctx.restore();
}

function drawCropBox(jc){
    const {
        bufferCanvas,
        _x: x,
        _y: y,
        _zoom: zoom
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