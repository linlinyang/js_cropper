/* /src/index.js */
import './polyfill/index';
import { initMixin } from './init';
import { canvasMixin } from './canvas';
import { lifyCircleMixin } from './lifeCircle';
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
drawMixin(JSCropper);

JSCropper.version = '__VERSION__';

export default JSCropper;