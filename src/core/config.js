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
    showCropperBox: { // 是否绘制裁剪框
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
    inSelecShadowColor: { // 未拖拽裁剪框时裁剪框时裁剪框外阴影颜色
        type: String,
        default: 'rgba(0,0,0,0.6)'
    },
    selectShadowColor: { // 拖拽裁剪框时裁剪框外阴影颜色
        type: String,
        default: 'rgba(0,0,0,0.4)'
    },
    showDashLine: { // 是否显示裁剪框中间虚线
        type: Boolean,
        defualt: true
    },
    dashLineColor: { // 裁剪框中间虚线颜色
        type: String,
        default: 'rgba(255,255,255,0.8)'
    },
    dashLineWidth: { // 虚线宽度
        type: Number,
        default: 3
    },
    backColor: { // 画布背景色
        type: String,
        defualt : 'rgba(0,0,0,0.7)'
    },
    imgType: { // 裁剪结果的图片类型
        type: String,
        default: 'image/png'
    },
    quality: { // 裁剪结果的图片质量
        type: Number,
        validator(val){
            return val >= 0 && val <= 1;
        },
        default: 1
    },
    rotateDeg: { //旋转角度
        type: Number,
        default: 0
    },
    scale: { // 缩放
        type: Array,
        default: [1,1]
    },
    debug: { // 是否显示调试信息
        type: Boolean,
        default: false
    }
};

export default function mergeOptions(options){
    const ret = {};

    Object.keys(defaultOptions).forEach(key => {
        let value = options[key];
        let {
            type,
            validator,
            default: defaultVal
        } = defaultOptions[key];
        
        if(type && !(value instanceof type)){
            value = defaultVal;
            console.warn(`Expect ${key}'s value is ${type} type.`);
        }

        if(validator && !validator(value)){
            value = defaultVal;
            console.warn(`Invalid ${key},custom validator check failed for ${key}`);
        }

        ret[key] = value === undefined 
                    ? defaultVal
                    : value;
        
        return ret;
    });
}