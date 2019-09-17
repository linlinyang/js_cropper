export function error(msg){
    throw new Error(`JSCropper Error: ${msg}`);
}

export function warn(msg){
    console.warn(`JSCropper Warn: ${msg}`);
}

export function log(msg){
    console.log(`JSCroppe: ${msg}`);
}
