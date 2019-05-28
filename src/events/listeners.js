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
    if(!el){
        return ;
    }
    let len = cacheEvents.length;

    let rmIndexs = [];
    while(len--){
        let {
            el: cacheEl,
            type: cacheType,
            handler: cacheHandler,
            options: cacheOptions
        } = cacheEvents[len];

        if(cacheEl !== el){
            continue;
        }

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