function eventMixin(JSCropper){

    const cacheEvents = [];

    JSCropper.prototype.on = function(type,handler,options = false){
        const jc = this;
        const canvas = jc.canvas;

        if(type === undefined || handler === undefined){
            return ;
        }

        canvas.addEventListener( type, handler, options );
        catcheEvents.push({
            type,
            handler,
            options
        });
    };

    JSCropper.prototype.off = function(type,handler,options = false){
        const jc = this;
        const canvas = jc.canvas;
        let len = cacheEvents.length;

        let rmIndexs = [];
        while(len--){
            let caches = cacheEvents[len];
            let {
                type: cacheType,
                handler: cacheHandler,
                options: cacheOptions
            } = caches;

            if(
                type === undefined
                || ( handler === undefined && type === cacheType )
                || ( options === undefined && type === cacheType && handler === cacheHandler )
                || ( type === cacheType && handler === cacheHandler && options === cacheOptions )
            ){
                rmIndexs.push(len);
                canvas.removeEventListener( cacheType, cacheHandler, cacheOptions );
            }
        }

        rmIndexs.forEach(( val ) => {
            cacheEvents.splice( val, 1 );
        });
    }

}

export {
    eventMixin
};