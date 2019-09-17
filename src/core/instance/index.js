/* /src/core/instance/index.js */
import initMixin from './initMixin';
import {
    lifyCircleMixin
} from './lifecycle';
import {
    canvasMixin
} from './canvasMixin';

class JSCropper{

    constructor(options){
        this._init(options);
    }

}

initMixin(JSCropper);
lifyCircleMixin(JSCropper);
canvasMixin(JSCropper);

export default JSCropper;