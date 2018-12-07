/**
 * 相关
 */
function Sdj(){
    this.container ;
    this.time = 100;
    this.users = [];//所有人
    this.prizeUser1 = [];//1等奖中奖人
    this.prizeUser2 = [];//2等奖中奖人
    this.prizeUser3 = [];//3等奖中奖人
    this.lastUsr = [];//剩余人
    this.config = {
        level1: 1,
        level2: 5,
        level3: 10
    }
    this.level = 3;
    this.isStart = false;
    this.apple = {};
    this.currentPrize = {};//当前中奖人
    this.userContainer;
    this.timeout = 15000;//每次抽奖时间 15秒结束
}
/**
 * 初始化
 */
Sdj.prototype.init = function(params) {
    this.apple = $('.apple');
    this.container = $('.slider_circle_10');
    this.userContainer = $('.prizeUser');
    this.getData();

}
/**
 * 获取人员数据
 */
Sdj.prototype.getData = function (){
    var _self = this;
	$.get('/data',function(data){
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
    // this.container.EasySlides({ 'autoplay': true, 'show': 13, 'delayaftershow': 1, 'timeout': this.time }) 
    luck.init();
    luck.EasySlidesNext(0)
}
/**
 * 获取随机中奖人
 */
Sdj.prototype.getRound = function (data) {
    var len = data.length;
    var round = Math.floor(Math.random() * 100);
    while(round >= len){
        //拿到随机数
        round = Math.floor(Math.random() * 100)
    }
    return data[round];
}
/**
 * 根据规则获取中奖人
 */
Sdj.prototype.getPrize = function () {
    if (this.prizeUser3.length === this.config.level3) {
        this.level = 2;
    }
    if (this.prizeUser2.length === this.config.level2) {
        this.level = 1;
    }
    if (this.prizeUser1.length === this.config.level1){
        return;
    }
    var user = this.getRound(this.users);
    this.currentPrize = user;
    if(this.level === 3 && this.prizeUser3.length < this.config.level3){
        //获取三等奖
        this.prizeUser3.push(user);
        this.userContainer.append(
            `<p>三等奖中奖人：<img src=${user.pic} />${user.name}</p>`
        )
    }
    if (this.level === 2 && this.prizeUser2.length < this.config.level2) {
        //获取二等奖 
        this.prizeUser2.push(user); 
        this.userContainer.append(
            `<p>二等奖中奖人：<img src=${user.pic} />${user.name}</p>`
        )
    }
    if (this.level === 1 && this.prizeUser1.length < this.config.level1) {
        //获取一等奖
        this.prizeUser1.push(user);
        this.userContainer.append(
            `<p>一等奖中奖人：<img src=${user.pic} />${user.name}</p>`
        )
    }
    this.deletePrize(user);
    this.render(this.setData(this.users,user));
}
/**
 * 获奖的人从数据中删除
 */
Sdj.prototype.deletePrize = function (user) {
    this.users = this.users.filter((item)=>{
        return item.key != user.key;
    })
} 
/**
 * 苹果开始下落
 */
Sdj.prototype.getAppleDown = function (params) {
    this.apple.animate({ top: '55%' }, this.timeout, "linear")
}
/**
 * 生成数据
 * 中将人在最后一个
 */
Sdj.prototype.setData = function (data,user) {
    
}
/**
 * 开始轮播
 * 抽奖
 */
Sdj.prototype.start = function () {
    // if(this.isStart){return;}
    this.getPrize();
    this.isStart = !this.isStart; 
    this.getAppleDown();
    luck.setStart(this.isStart);
}
