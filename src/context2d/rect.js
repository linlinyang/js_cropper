/* 
 * 根据方向绘制矩形，默认顺时针方向
 *
 * @params {CanvasRenderingContext2D} ctx;2d画布绘图对象
 * @params {Number} x;矩形起点x坐标
 * @params {Number} y;矩形起点y坐标
 * @params {Number} width;矩形宽度
 * @params {Number} height;矩形高度
 * @params {Boolean} counterClockWise;是否逆时针绘制
 */
function rect(ctx,x,y,width,height,counterClockWise = false){
    if( !counterClockWise ){//顺时针
        ctx.rect( x, y, width, height );
    }else{//逆时针
        ctx.moveTo( x, y );
        ctx.lineTo( x, y + height );
        ctx.lineTo( x + width, y + height );
        ctx.lineTo( x + width, y );
        ctx.lineTo( x, y );
    }
}

export {
    rect
};