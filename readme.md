
## js_cropper使用文档 ##
<p align='center'>
<img alt="npm" src="https://img.shields.io/npm/v/@yanglinlin/js_cropper.svg">
</p>

**js_cropper** 是一款使用html5画布元素进行图片裁剪压缩的js框架

### 安装 ###
1、script标签引入

```
<script src="../dist/JSCropper.js"></script>
```
2、npm安装

```
npm i @yanglinlin/js_cropper
```

### 使用 ###

```
//使用示例：
var jc = new JSCropper({
		el: '#cropper',
		img: './images/pic1.jpg',
		debug: true
	});
```

### 参数 ###
 1. el，String或HTMLElement类型，如果el是画布元素或画布选择器，则在该画布上进行图片裁剪；如果el是普通的HTMLElement元素，则会在该节点内创建一个裁剪画布
 2.  cropperWidth，Number类型，默认：800，整个裁剪画布宽度
 3. cropperHeight，Number类型，默认：600，整个裁剪画布高度
 4. img，String或HTMLElement类型，要裁剪的图片地址或图片元素（IE9及以下，input[type=file]传入的图片无法在画布中绘制）
 5. width，Number类型，默认：300，裁剪框宽度，即最终获取图片宽度
 6. height，Number类型，默认：300，裁剪框高度，即最终获取图片高度
 7. shadowColor，String类型，默认：rgba(0,0,0,0.7)，整个裁剪画布背景色
 8. edgeLineColor，String类型，默认：#fff，裁剪框边线颜色
 9. edgeLineWidth，Number类型，默认：3，裁剪框外框线宽
 10. dashLineColor，String类型，默认：rgba(255,255,255,0.8)，裁剪框中间虚线颜色
 11. quality，Number类型，默认：1，图片格式设置为imag/.jpg 时，设置最终获取的图片质量
 12. imgType，String类型，默认：image/png，最终获取图片类型
 13. inSelectBackColor，String类型，默认：rgba(0,0,0,0.6)，未拖拽裁剪框时，裁剪框外阴影颜色
 14. selectBackColor，String类型，默认：rgba(0,0,0,0.4)，拖拽裁剪框时，裁剪框外阴影颜色
 
  *钩子函数：*
 
 16. beforeCreate，开始创建裁剪元素
 17. created，裁剪元素已经绘制完成
 18. beforeDestory，开始销毁
 19. destoryed，销毁完成
 20. onUpdate，更新完成

### 实例方法 ###

 1. cut，获取裁剪框选中部分图片并返回base64图片
 2. update，更新裁剪参数，并重绘裁剪画布
 3. reset，重置裁剪框位置在裁剪画布中间
 4. destory，销毁裁剪实例
 以上方法只有update方法有参数，参数是Object类型，可包含属性为 ### 参数 ### 中包含的属性