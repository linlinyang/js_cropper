/* /src/core/instance/index.js */
import initMixin from './init';
import {
    lifyCircleMixin
} from './lifecycle';
import {
    canvasMixin
} from './canvas';

class JSCropper{

    constructor(options){
        this._init(options);
    }

}

initMixin(JSCropper);
lifyCircleMixin(JSCropper);
canvasMixin(JSCropper);

export default JSCropper;