function callHook(jc,hook){
    const handler = jc[hook];
    typeof handler === 'function' && handler.call(jc);
}

function lifyCircleMixin(JSCropper){

    JSCropper.prototype.update = function(options){
        const jc = this;
        callHook(jc,'beforeUpdate');
        if( Object.keys(options) === 0 ){
            return ;
        }
        Object.assign(jc,options);
        jc._redraw();
        callHook(jc,'updated');
    };

    JSCropper.prototype.destroy = function(){
        const jc = this;
        callHook(this,'beforeDestory');

        jc.off();
    }
    
    JSCropper.prototype.reset = function(){
        callHook(this,'beforeReset');
    };
    
}

export {
    lifyCircleMixin,
    callHook
};