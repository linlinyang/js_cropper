/* /src/core/instance/lifecycls.js */
import {
    typeOf
} from '../../utils/tool';

export function callhook(jc,hook){
    const handler = jc[hook];
    
    if(handler && typeOf(handler) === 'function'){
        handler.call(jc);
    }
}