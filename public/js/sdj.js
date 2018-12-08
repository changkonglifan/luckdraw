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
    this.circleRun = 1;
    this.isEnd = false; 
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
        _self.render(data.data);
        _self.users = data.data;
        _self.lastUsr = data.data;
        _self.renderSlide();
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
    this.container.empty();
    this.container.append(html); 
}
/**
 * 创建跑马场
 * @return {[type]} [description]
 */
Sdj.prototype.renderSlide = function () {
    // this.container.EasySlides({ 'autoplay': true, 'show': 13, 'delayaftershow': 1, 'timeout': this.time }) 
    luck.init(this.circleCallback,this);
    luck.EasySlidesNext()
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
        alert('抽奖已结束');
        this.isEnd = true;
        return;
    }
    var user = this.getRound(this.lastUsr);
    this.currentPrize = user;
    if(this.level === 3 && this.prizeUser3.length < this.config.level3){
        //获取三等奖
        this.prizeUser3.push(user);
    }
    if (this.level === 2 && this.prizeUser2.length < this.config.level2) {
        //获取二等奖 
        this.prizeUser2.push(user); 
    }
    if (this.level === 1 && this.prizeUser1.length < this.config.level1) {
        //获取一等奖
        this.prizeUser1.push(user);
    }
}
/**
 * 写入列表
 */
Sdj.prototype.renderPrizeList = function () {
    var leveList = ['一','二','三'];
    this.userContainer.append(
        `<p>${leveList[this.level - 1]}等奖中奖人：<img src=${this.currentPrize.pic} />${this.currentPrize.name}</p>`
    )
}
/**
 * 重新设置跑马场
 */
Sdj.prototype.resetLuck = function (user) {
    this.render(this.lastUsr);
    this.renderSlide();
    this.getAppleTimeout();
}
/**
 * 获奖的人从数据中删除
 */
Sdj.prototype.deletePrize = function (user) {
    this.lastUsr = this.lastUsr.filter((item)=>{
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
 * 苹果位置还原
 */
Sdj.prototype.setAppleBack = function (params) { 
    this.apple.css('top', '0')
}
/**
 * 生成数据
 * 中将人在最后一个
 */
Sdj.prototype.setData = function (data,user) {
    var newData = data.filter((item)=>{
        return item.key != user.key;
    })
    newData.push(user);//把中奖人放到最后
    return newData;
}
/**
 * 获取苹果下落时间
 * 跑马场转两圈
 * 第一圈 100 一个
 * 第二圈 200 10个 
 * 300 10个
 * 400 10个
 * 500 10个
 * 600 10个
 * 1s 剩余
 */
Sdj.prototype.getAppleTimeout = function () {
    var len = this.lastUsr.length ;
    var timeout = 100 * len + 200 * 10 + 400 * 10 + 600 *10
        + 800 * 10  + (len - 40) * 1000;
    this.timeout = timeout;
}
/**
 * 跑马场跑圈回调
 */
Sdj.prototype.circleCallback = function () {
    if (this.circleRun  === this.lastUsr.length){
        //跑动一圈
        this.render(this.setData(this.lastUsr, this.currentPrize));
        // // this.renderSlide();
        luck.setSpeed(200);
        this.setEase(0.2);
    }else if(this.circleRun === this.lastUsr.length + 10){
        luck.setSpeed(400);
        this.setEase(0.4);
    } else if (this.circleRun === this.lastUsr.length + 20) {
        luck.setSpeed(600);
        this.setEase(0.6);
    } else if (this.circleRun === this.lastUsr.length + 30) {
        luck.setSpeed(800);
        this.setEase(0.8);
    } else if (this.circleRun === this.lastUsr.length + 40) {
        luck.setSpeed(1000);
        this.setEase(1);
    }  else if (this.circleRun>= this.lastUsr.length * 2 - 1) {
        //两圈结束 
        this.resetSdj(); 
    }
    this.circleRun ++;
}
/**
 * 设置平滑速度
 */
Sdj.prototype.setEase = function (spd) {
    this.container.find('> *').css('transition', 'ease all ' + spd + 's')
}
/**
 * 重新设置
 */
Sdj.prototype.resetSdj = function (params) {
    this.isStart = false;
    luck.setStart(this.isStart);
    this.circleRun = 0;//还原计数器
    setTimeout(() => {
        this.renderPrizeList();//写入获奖列表
        luck.setSpeed(100);//还原速度
        this.setEase(0.1)
    }, 1000);
    this.deletePrize(this.currentPrize);
    this.lastUsr = shuffleData(this.lastUsr);//打乱排序
}
/**
 * 开始轮播
 * 抽奖
 */
Sdj.prototype.start = function () {
    if (this.isStart) { return; }
    this.setAppleBack();//还原苹果位置
    this.getPrize();//拿到中奖人
    if (!this.isEnd){
        this.resetLuck(this.currentPrize);//
        this.isStart = !this.isStart;//设置跑马场开跑  
        this.getAppleDown();//开始苹果下落
        luck.setStart(this.isStart);//跑马场开跑
    }
}
