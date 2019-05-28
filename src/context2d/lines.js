/* 
 * 画布线条操作
 *
 * 线条绘制时都是基于线条中间开始绘制，就会存在如下bug
 * 
 * 例如绘制一条(100,300)到(200,300)的水平线条
 * 当要绘制的线条宽度是奇数时，假如设置为1，则线条就会在y轴方向299.5~300.5之间绘制一条线宽为1的直线，但是，由于canvas的渲染机制，无法渲染半个像素，所以299至301都会被填充，就会出现线条宽度变成2的效果，但是线条颜色会淡很多
 * 当要绘制的线条宽度是偶数时，假如设置为2，则线条会在y轴方向300上向上向下扩张1px，即299~301之间绘制一条2px的直线，没有多余，所以线条颜色就是设置的颜色
 * 
 * 所以如果线宽是偶数时，线条的位置就要在整数的坐标上；反之，则要偏移半个像素来绘制所要达到的效果
 */

import { distance } from '../utils/tool';

function convertNum(coord,lineWidth){
    return Math.floor( coord ) + ( lineWidth % 2 ) / 2;
}

/* 
 * 移动绘图路径起点
 *
 * @params {CanvasRenderingContext2D} ctx;2d画布绘图对象
 * @params {Number} x;起点x坐标
 * @params {Number} y;起点y坐标
 * @params {Boolean} isSolid;是否需要转换为实线
 */
function moveTo(ctx,x,y,isSolid = false){
    const lineWidth = ctx.lineWidth;
    if(isSolid){
        ctx.moveTo(
            convertNum( x, lineWidth ),
            convertNum( y, lineWidth )
        );
    }else{
        ctx.moveTo(x,y);
    }
}

/* 
 * 绘制1px线段，canvas绘制1px线条bug，需要转换0.5px
 *
 * @params {CanvasRenderingContext2D} ctx;2d画布绘图对象
 * @params {Number} x;线段终点x坐标
 * @params {Number} y;线段终点y坐标
 * @params {Boolean} isSolid;是否需要转换为实线
 */
function lineTo(ctx,x,y,isSolid = false){
    const lineWidth = ctx.lineWidth;
    if(isSolid){
        ctx.lineTo(
            convertNum( x, lineWidth ),
            convertNum( y, lineWidth )
        );
    }else{
        ctx.lineTo(x,y);
    }
}

/* 
 * 根据方向绘制矩形，默认顺时针方向
 *
 * @params {CanvasRenderingContext2D} ctx;2d画布绘图对象
 * @params {Number} x;矩形起点x坐标
 * @params {Number} y;矩形起点y坐标
 * @params {Number} width;矩形宽度
 * @params {Number} height;矩形高度
 * @params {Boolean} counterClockWise;是否逆时针绘制
 * @params {Boolean} isSolid;是否需要转换为实线
 */
function rect(ctx,x,y,width,height,counterClockWise = false,isSolid = false){
    const lineWidth = ctx.lineWidth;
    let xDistance = x + width;
    let yDistance = y + height;
    if(isSolid){
        x = convertNum( x, lineWidth );
        y = convertNum( y, lineWidth );
        xDistance = convertNum( x + width, lineWidth );
        yDistance = convertNum( y + height, lineWidth );
    }
    if( !counterClockWise ){//顺时针
        ctx.moveTo( x, y );
        ctx.lineTo( xDistance, y );
        ctx.lineTo( xDistance, yDistance );
        ctx.lineTo( x, yDistance );
    }else{//逆时针
        ctx.moveTo( x, y );
        ctx.lineTo( x, yDistance );
        ctx.lineTo( xDistance, yDistance );
        ctx.lineTo( xDistance, y );
    }
    ctx.closePath();
}

/* 
 * 虚线绘制，从起点绘制一条至终点的虚线
 *
 * @params {CanvasRenderingContext2D} ctx;2d画布绘图对象
 * @params {Number} sx; 起点x坐标
 * @params {Number} sy;起点y坐标
 * @params {Number} dx;终点x坐标
 * @params {Number} dy;终点y坐标
 * @params {Number} step;虚线长度
 */
function dashLine(ctx,sx,sy,dx,dy,step = 5, isSolid = false){
    const length = distance( sx, sy, dx, dy );
    const dotNums = Math.floor( length / step );
    const xStep = ( dx - sx ) / dotNums;
    const yStep = ( dy - sy ) / dotNums;
    for(let i = 0; i < dotNums; i++){
        let x = sx + i * xStep;
        let y = sy + i * yStep;
        
        (i & 1) ? lineTo(ctx,x,y,isSolid) : moveTo(ctx,x,y,isSolid);
    }
}

export {
    moveTo,
    lineTo,
    rect,
    dashLine
};