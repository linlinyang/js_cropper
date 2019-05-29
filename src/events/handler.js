import {getEvent} from './listeners';
import {window2canvas} from '../utils/tool';

/* 
 * 判断坐标点是否在裁剪框之内
 */
function inCropBox(jc,x,y){
    const {
        canvas,
        _zoom: zoom,
        width,
        height,
        _x: cx,
        _y: cy
    } = jc;
    if(
        x > cx 
        && x < cx + width * zoom
        && y > cy
        && y < cy + height * zoom
    ){//在裁剪框之内
        canvas.style.cursor = 'move';
        return true;
    }else{//不在裁剪框之内
        canvas.style.cursor = 'default';
        return false;
    }
}

let isDragging = false;
let disX = 0;
let disY = 0;

/* 
 * 鼠标或者touchstart回调，设置当前点击点距离裁剪框当前距离
 */
function down(jc){
    return (e) => {
        const event = getEvent(e);
        const {
            canvas,
            _x: cx,
            _y: cy
        } = jc;
        const {
            x,
            y
        } = window2canvas(canvas,event.clientX,event.clientY);
        isDragging = inCropBox(jc,x,y);
        disX = x - cx;
        disY = y - cy;
        jc.isDragging = isDragging;
    }
}

/* 
 * 设置裁剪框坐标，重绘画布
 */
function move(jc){
    return (e) => {
        const event = getEvent(e);
        const {
            canvas,
            width,
            height,
            cropperWidth,
            cropperHeight,
            _zoom: zoom
        } = jc;
        const {
            x,
            y
        } = window2canvas(canvas,event.clientX,event.clientY);
        const limitX = ( cropperWidth - width ) * zoom;//x坐标不超出图片右边
        const limitY = ( cropperHeight - height ) * zoom ;//x欧标不超出图片下边
        inCropBox(jc,x,y);

        if(isDragging){
            jc._x = Math.max( 0, Math.min( limitX,  x - disX ) );
            jc._y = Math.max( 0, Math.min( limitY, y - disY ) );
            jc._redraw();
        }
    };
}

/* 
 * 放弃拖拽，重绘画布
 */
function up(jc){
    return (e) => {
        jc.isDragging = isDragging = false;
        jc._redraw();
    }
}

export {
    up,
    move,
    down
};