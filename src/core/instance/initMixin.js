/* /src/core/instance/updateMixin */

import configOptions from '../config';
import initWrapper from './wrapper';
import {
    callhook
} from './lifecycle';

export default function initMixin(JSCropper){

    let uid = 1;
    JSCropper.prototype._init = function(options){
        const jc = this;

        Object.assign(jc,configOptions,options);
        jc._uid = uid++;

        jc.debug && console.log('开始绘制裁剪窗...');

        callhook('breforeCreate');
        initWrapper(jc);

        return jc;
    };

    JSCropper.prototype.update = function(options){
        return this._init(options);
    }

}