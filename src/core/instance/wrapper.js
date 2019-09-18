/* /src/core/instance/wrapper */

import {
    typeOf
} from '../../utils/tool';
import {
    error
} from '../../utils/debug';

function isCanvas(node){
    return !!node && node instanceof HTMLCanvasElement;
}

export default function initWrapper(jc){
    installCanvas(jc);
    
}

function installCanvas(jc){
    const {
        el
    } = jc;
    const $el = typeOf(el) === 'string'
                ? document.querySelector(el)
                : el;
        
    if(isCanvas($el)){
        jc.canvas = $el;
    }else{
        if(!validateWrapper($el)){
            error('Canvas container type error');
        }

        const canvas = document.createElement('canvas');
        canvas.innerHTML = '你的浏览器不支持画布元素';
        jc.canvas = canvas;
        $el.appendChild(canvas);
    }
}

function validateWrapper(element){
    return !!element && element instanceof HTMLElement && element.nodeType === 1;
}
