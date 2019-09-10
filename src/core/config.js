export default {
    cropperWidth: 800,
    cropperHeight: 600,
    width: 300,
    height: 300,
    shadowColor: 'rgba(0,0,0,0.7)',
    edgeLineColor: '#fff',
    edgeLineWidth: 3,
    dashLineColor: 'rgba(255,255,255,0.8)',
    quality: 1,
    imgType: 'image/png',
    inSelectBackColor: 'rgba(0,0,0,0.6)',
    selectBackColor: 'rgba(0,0,0,0.4)',
    rotate: 0,
    scale: 1,
    drawCropperBox: true,
    debug: true
};

const defaultOptions = {
    cropperWidth: { // 裁剪屏宽度
        type: Number,
        default: 800
    },
    cropperHeight: { // 裁剪屏高度
        type: Number,
        default: 600
    },
    width: { // 裁剪框宽度
        type: Number,
        default: 300,
    },
    height: { // 裁剪框高度
        type: Number,
        default: 300
    },
    showCropperBox: {
        type: Boolean,
        default: true
    },
    edgeLineColor: { // 裁剪框边线颜色
        type: String,
        default: '#fff'
    },
    edgeLineWidth: { // 裁剪框边线线宽
        type: Number,
        default: 3
    },
    dashLineColor: { // 裁剪框中间虚线颜色
        type: String,
        default: 'rgba(255,255,255,0.8)'
    },
    showDashLine: { // 是否显示裁剪框中间虚线
        type: Boolean,
        defualt: true
    },
    backColor: { // 画布背景色
        type: String,
        validator(val){

        }
    },
    imgType: { // 裁剪结果的图片类型
        type: String,
        validator(val){
            return ['image/jpeg','image/png','image/webp'].includes(val);
        },
        default: 'image/png'
    },
    quality: { // 裁剪结果的图片质量
        type: Number,

    }
};

export function mergeOptions(){

}