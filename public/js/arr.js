/**
 * 打乱数据
 */
function shuffleData(data) {
    if (data instanceof Array) {
        data = data.shuffle()
    }  
    return data;
}
/**
 * 打乱数组
 */
Array.prototype.shuffle = function () {
    let m = this.length, i;
    while (m) {
        i = (Math.random() * m--) >>> 0;
        [this[m], this[i]] = [this[i], this[m]]
    }
    return this;
}