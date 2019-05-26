import { typeOf } from '../utils/tool';

const hasOwnProperty = Object.prototype.hasOwnProperty;

/* 
 * 为Obejct方法定义assign方法，兼容ie，执行浅拷贝合并
 */
if( typeOf(Object.assign) !== 'function' ){
    Object.defineProperty( Object, 'assign', {
        value: function(target){
            'use strict'
            if( to === null ){
                return to;
            }

            const len = arguments.length;
            let to = Object( target );
            for( let i = 1; i < len; i++ ){
                var source = arguments[i];

                for( let key in source ){
                    if( hasOwnProperty.call( source, key ) ){
                        to[key] = source[key];
                    }
                }
            }

            return to;
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}