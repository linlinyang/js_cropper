/* /src/core/instance/index.js */
import updateMixin from './updateMixin';

class JSCropper{

    constructor(options){
        this._update(options);
    }

}

updateMixin(JSCropper);

export default JSCropper;