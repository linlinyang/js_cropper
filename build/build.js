/* /build/build.js */
import buble from 'rollup-plugin-buble';//convert ES2015 with buble
import flow from 'rollup-plugin-flow-no-whitespace';//remove flow types, without leaving whitespace
import commonjs from 'rollup-plugin-commonjs';
import node from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';

const path = require('path');
const resolve = _path => path.resolve(__dirname,'../',_path);
const packageInfo = require('../package.json');
const version = process.env.VERSION || packageInfo.version;
const authorName = packageInfo.author;
const banner = 
`/* !
  * JSCropper v${version}
  * https://github.com/linlinyang/js_cropper.git
  * 
  * (c) ${new Date().getFullYear()} ${authorName}
  */
`;

const outputs = [{
    file: resolve('dist/JSCropper.js'),
    format: 'umd',
    env: 'development'
},{
    file: resolve('dist/JSCropper.min.js'),
    format: 'umd',
    env: 'production'
},{
    file: resolve('dist/JSCropper.common.js'),
    format: 'cjs'
},{
    file: resolve('dist/JSCropper.esm.js'),
    format: 'es'
}];

function buildRollupConfig(output){
    let config = {
        input: resolve('src/index.js'),
        plugins: [
            flow(),
            node(),
            commonjs(),
            replace({
                __VERSION__: version
            }),
            buble(),
            babel({
                extensions: [".js"],
                runtimeHelpers: true,
                exclude: ["node_modules/**"]
            })
        ],
        output: {
            file: output.file,
            format: output.format,
            banner,
            name: 'JSCropper'
        }
    };

    if(output.env){
        config.plugins.unshift(replace({
            'process.env.NODE_ENV': JSON.stringify(output.env)
        }));
        if(output.env.includes('prod')){
            config.plugins.push(uglify());
        }
    }

    return config;
}

export default outputs.map(buildRollupConfig);

