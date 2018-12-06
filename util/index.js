
var util = {};
/**
 * 打乱数据
 */
util.shuffleData = function(data) {
    if(data.data instanceof Array ){
        data.data = data.data.shuffle()
    }else{
        data.data = [];
    }
    return  data;
}
/**
 * 打乱数组
 */
Array.prototype.shuffle = function() {
    let m = this.length, i;
    while (m) {
        i = (Math.random() * m--) >>> 0;
        [this[m], this[i]] = [this[i], this[m]]
    }
    return this; 
}
module.exports = util;