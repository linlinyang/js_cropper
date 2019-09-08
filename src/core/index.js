/* /src/index.js */

import '../polyfill/index';
import JSCropper from './instance/index';
import initGlobalAPI from './global-api/index';

initGlobalAPI(JSCropper);

export default JSCropper;