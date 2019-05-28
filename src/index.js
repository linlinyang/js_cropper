/* /src/index.js */
import './polyfill/index';
import { initMixin } from './init';
import { lifyCircleMixin } from './lifeCircle';
import { canvasMixin } from './canvas';
import { eventMixin } from './eventMixin';
import { drawMixin } from './draw';
//import {initCropperBox} from './croperBox';

class JSCropper{

    constructor(options){
        this._init(options);
    }

}

initMixin(JSCropper);
lifyCircleMixin(JSCropper);
canvasMixin(JSCropper);
eventMixin(JSCropper);
drawMixin(JSCropper);

JSCropper.version = '__VERSION__';

export default JSCropper;