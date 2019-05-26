function callHook(jc,hook){
    const handler = jc[hook];
    typeof handler === 'function' && handler.call(jc);
}

function lifyCircleMixin(JSCropper){
    JSCropper.prototype.destroy = function(){
        callHook(this,'beforeDestory');
    }
}

export {
    lifyCircleMixin,
    callHook
};