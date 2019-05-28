import {getEvent} from './listeners';
import {window2canvas} from '../utils/tool';

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
    ){
        canvas.style.cursor = 'move';
        return true;
    }else{
        canvas.style.cursor = 'default';
        return false;
    }
}

let isDragging = false;
let disX = 0;
let disY = 0;
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
    }
}

function move(jc){
    return (e) => {
        const event = getEvent(e);
        const {
            canvas,
            _x: cx,
            _y: cy,
            width,
            height,
            cropperWidth,
            cropperHeight,
            edgeLineWidth,
            _zoom: zoom
        } = jc;
        const {
            x,
            y
        } = window2canvas(canvas,event.clientX,event.clientY);
        const limitX = ( cropperWidth - width - edgeLineWidth ) * zoom;
        const limitY = ( cropperHeight - height - edgeLineWidth ) * zoom;

        inCropBox(jc,x,y);

        if(isDragging){
            jc._x = Math.min( 0, Math.max( limitX, ( x - disX) * zoom ) );
            jc._y = Math.min( 0, Math.max( limitY, ( y - disY) * zoom ) );
            jc._redraw();
        }
    };
}

function up(jc){
    return (e) => {
        isDragging = false;
    }
}

export {
    up,
    move,
    down
};