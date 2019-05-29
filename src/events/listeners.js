const cacheEvents = [];

function on(el,type,handler,options = false){
    el.addEventListener( type, handler, options );
    cacheEvents.push({
        el,
        type,
        handler,
        options
    });
};

function off(el,type,handler,options = false){
    let len = cacheEvents.length;

    let rmIndexs = [];
    while(len--){
        let {
            el: cacheEl,
            type: cacheType,
            handler: cacheHandler,
            options: cacheOptions
        } = cacheEvents[len];

        if(
            !el
            || ( el === cacheEl && type === undefined )
            || ( handler === undefined && type === cacheType && el === cacheEl )
            || ( options === undefined && type === cacheType && handler === cacheHandler && el === cacheEl )
            || ( type === cacheType && handler === cacheHandler && options === cacheOptions && el === cacheEl )
        ){
            rmIndexs.push(len);
            cacheEl.removeEventListener( cacheType, cacheHandler, cacheOptions );
        }
    }

    rmIndexs.forEach(( val ) => {
        cacheEvents.splice( val, 1 );
    });
};

function getEvent(e){
    return e.changedTouches
        ? e.changedTouches[0]
        : e;
}

export {
    on,
    off,
    getEvent
};