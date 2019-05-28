import {up,move,down} from './events/handler';
import { on } from './events/listeners';

function eventMixin(JSCropper){

    JSCropper.prototype._bindDrag = function(){
        const jc = this;

        on( window, 'mousedown', down(jc), false );
        on( window, 'mousemove', move(jc), false );
        on( window, 'mouseup', up(jc), false );
        on( window, 'touchstart', down(jc), false );
        on( window, 'touchmove', move(jc), false );
        on( window, 'touchend', up(jc), false );
    };
}

export {
    eventMixin
};