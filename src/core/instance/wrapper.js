/* /src/core/instance/wrapper */

import {
    typeOf
} from '../../utils/tool';

function isCanvas(node){
    return node instanceof HTMLCanvasElement;
}

export default function initWrapper(jc){
    const {
        el,
        cropperWidth,
        cropperHeight
    } = jc;
    const $el = typeOf(el) === 'string'
                    ? document.querySelector(el)
                    : isCanvas(el) && el;
    
}
