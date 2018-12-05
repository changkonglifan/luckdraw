/**
 * 相关
 */
function Sdj (container){
    this.container = container;
    this.time = 10900;
    this.users = [];
}

Sdj.prototype.getData = function (){
    var _self = this;
	$.get('/data',function(data){
        _self.render(JSON.parse(data).data);
        _self.renderSlide();
        _self.users = data.data;
	})
}
/**
 * 生成
 * @return {[type]} [description]
 */
Sdj.prototype.render = function(data) {
    var html = '';
    data.forEach(element => {
        html += `<div><img src=${element.pic} /> ${element.name} </div>`;
    });
    this.container.append(html); 
}
/**
 * 创建跑马场
 * @return {[type]} [description]
 */
Sdj.prototype.renderSlide = function (data) {
    this.container.EasySlides({ 'autoplay': true, 'show': 13, 'delayaftershow': 1, 'timeout': this.time }) 
}
