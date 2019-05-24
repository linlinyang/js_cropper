/* /src/index.js */
import {initMixin} from './init';
import {initCropperBox} from './croperBox';

class JSCropper{

    constructor(options){
        this._init(options);
    }

}

initMixin(JSCropper);
initCropperBox(JSCropper);
/* initImage(JSCropper);
initCanvas(JSCropper);
initEvents(JSCropper); */


export default JSCropper;