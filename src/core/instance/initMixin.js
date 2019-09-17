/* /src/core/instance/updateMixin */

import initWrapper from './wrapper';
import mergeOptions from '../config';
import {
    log
} from '../../utils/debug';

import {
    callhook
} from './lifecycle';

export default function initMixin(JSCropper){

    let uid = 1;
    JSCropper.prototype._init = function(options){
        const jc = this;

        Object.assign(jc,mergeOptions(options));
        jc._uid = uid++;

        jc.debug && log('before create');

        callhook('breforeCreate');
        initWrapper(jc);

        return jc;
    };

    JSCropper.prototype.update = function(options){
        return this._init(options);
    }

}