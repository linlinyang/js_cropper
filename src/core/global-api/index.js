/* /src/core/global-api */

import getVersion from './getVersion';
import { typeOf } from '../../utils/tool';

export default function initGlobalAPI(JSCropper){

    JSCropper.getVersion = getVersion;
    JSCropper.typeOf = typeOf;
    
}