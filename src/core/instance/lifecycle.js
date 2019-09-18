/* /src/core/instance/lifecycls.js */
import {
    typeOf
} from '../../utils/tool';
import {
    log
} from '../../utils/debug';

export function callhook(jc,hook){
    const handler = jc[hook];
    
    if(handler && typeOf(handler) === 'function'){
        handler.call(jc);
    }
}

export function lifyCircleMixin(JSCropper){

    JSCropper.prototype.update = function(options){
        const jc = this;
        jc.debug && log('before update');
        callhook(jc,'beforeUpdate');
        Object.assign(jc,mergeOptions(options));

    };

    JSCropper.prototype.reset = function(){
        const jc = this;
    }

    JSCropper.prototype.destroyed = function(){
        const jc = this;
    };

}