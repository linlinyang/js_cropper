/* 
 * 工具方法
 */

 /* 
  * 查看元素的offset相对body的距离
  *
  * @params {HTMLElement} el; 要查看的元素
  * 
  * @return {Object};返回要查看元素左上距离
  */
 
function offset(el){
    let pat = el,
        top = 0,
        left= 0;
    
    while(pat){
        top += pat.offsetTop;
        left += pat.offsetLeft;
        pat = pat.offsetParent;
    }

    return {
        top,
        left
    };
}

export {
    offset
};