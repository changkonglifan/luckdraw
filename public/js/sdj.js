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
    this.isStart = true;
    this.apple = {};
    this.currentPrize = {};//当前中奖人
    this.userContainer;
    this.timeout = 15000;//每次抽奖时间 15秒结束
    this.circleRun = 0;
    this.isEnd = false; 
    this.isSpeedDown = false;//开始减速
    this.cover ;
    this.prizeBg;
    this.canvas; 
}
/**
 * 初始化
 */
Sdj.prototype.init = function(params) {
    this.apple = $('.apple');
    this.container = $('.slider_circle_10');
    this.userContainer = $('.prizeUser'); 
    this.prizeBg = $('.prizeBg');
    this.cover = $(".cover");
    this.canvas = $('#canvas');
    this.getData();
    this.getAppleTimeout();
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
        html += `<div key=${element.key}><img src=${element.pic} /> ${element.name} </div>`;
    }); 
    this.container.empty();
    this.container.append(html); 
}
/**
 * 创建跑马场
 * @return {[type]} [description]
 */
Sdj.prototype.renderSlide = function () { 
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
    return user;
}
/**
 * 写入列表
 */
Sdj.prototype.renderPrizeList = function () {
    var leveList = ['一','二','三'];
    this.userContainer.text(
        `${leveList[this.level - 1]}等奖：${this.currentPrize.name}`
    )
    this.showEffect(true);
}
/**
 * 显示效果
 */
Sdj.prototype.showEffect = function (flag) {
    if (flag) {
        this.prizeBg.show();
        this.userContainer.show();
        this.cover.show();
        this.canvas.show();
    } else {
        this.prizeBg.hide();
        this.userContainer.hide();
        this.cover.hide();
        this.canvas.hide();
    }
}
/**
 * 重新设置跑马场
 */
Sdj.prototype.resetLuck = function () {
    this.isStart = true;
    this.circleRun = 0;
    this.isSpeedDown = false;
    luck.setStart(this.isStart);//重新开始跑 
    this.lastUsr = shuffleData(this.lastUsr);//打乱排序
    this.render(this.lastUsr);
    this.renderSlide();
    this.getAppleTimeout();
    this.setAppleBack();
    this.showEffect(false);
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
Sdj.prototype.getAppleDown = function () {
    this.apple.animate({ top: '43.24%',marginTop: "-145px"}, this.timeout, "linear")
}
/**
 * 苹果位置还原
 */
Sdj.prototype.setAppleBack = function () { 
    this.apple.css({'top' : '9%','margin-top':'-30px'});
}
/**
 * 生成数据
 * 中将人在最后一个
 * 取前19个
 */
Sdj.prototype.setData = function (data,user,lastTen) {
    var filterData = data.filter((item)=>{
        //去掉中奖人
        return item.key != user.key;
    }).filter((item)=>{
        //去掉active后十个
        return lastTen.indexOf(item.name) < 0;
    }).filter((item,index) => {
        //选择前三十个
        return index < 30;
    })
    //把中将人放到第二十个
    filterData[19] = user;  
    return filterData;
}

/**
 * 重新设置获取中奖人后的跑马场
 */
Sdj.prototype.getAfterPrize = function (user) {
    var lastTen = $('div[class*=active],div[class*=next]').text();
    var data = this.setData(shuffleData(this.lastUsr), user,lastTen);//之后的二十个数组
    this.renderAfterPrize(data);
}  

/**
 * 渲染获取数据后的数组
 */
Sdj.prototype.renderAfterPrize = function (data) {
    var html = '';
    data.forEach(element => {
        html += `<div class='hidden' key=${element.key}><img src=${element.pic} /> ${element.name} </div>`;
    });
    console.log(`插入位置${$('.next9').index()} ${$('.next9').text()}  ${$('.active').text()}`);
    $(html).insertAfter($('.next9'));
}
/**
 * 获取苹果下落时间
 * 从点击按钮开始减速
 * 一共30个
 * 100 5个
 * 200 5个
 * 400 5个
 * 600 5个
 * 800 8个 
 */
Sdj.prototype.getAppleTimeout = function () {
    var timeout = 200 * 5 + 400 * 5 + 600 * 5 + 800 * 8 + 5 * 100;
    this.timeout = timeout;
}
/**
 * 跑马场跑圈回调
 */
Sdj.prototype.circleCallback = function () {
    if($('.next9').index() == 2){
        this.start();
    }
    if (this.isSpeedDown){
        if (this.circleRun === 5) {
            luck.setSpeed(200);
            this.setEase(0.2);
        } else if (this.circleRun === 10) {
            luck.setSpeed(400);
            this.setEase(0.4);
        } else if (this.circleRun === 15) {
            luck.setSpeed(600);
            this.setEase(0.6);
        } else if (this.circleRun === 20) {
            luck.setSpeed(800);
            this.setEase(0.8);
        } else if (this.currentPrize.key + '' == $('.next1').attr('key').trim() && this.circleRun > 20) {
            //29个结束 
            console.log(this.circleRun);
            this.resetSdj(); 
        }
        if (this.circleRun >= 28) {
            debugger;
            console.log(this.currentPrize.key + this.currentPrize.name + '--------------'  + $('.next1').attr('key').trim());
        }
        this.circleRun ++;
    }
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
    setTimeout(() => {
        this.resetLuck();
    }, 10000);
    this.deletePrize(this.currentPrize);
}
/**
 * 开始轮播
 * 抽奖
 * 苹果开始下落
 * 跑马场开始减速
 * 从剩余中奖人中，获取三十个人插入最后
 * 减速到最后一个人
 */
Sdj.prototype.start = function () {
    if (this.isSpeedDown) { return; } 
    this.getAppleDown();//开始苹果下落 
    var user = this.getPrize();//拿到中奖人
    this.currentPrize = user;
    if (!this.isEnd){  
        this.isStart = !this.isStart;
        luck.setStart(this.isStart);
        this.getAfterPrize(user);
        this.isSpeedDown = true;//开始减速
        this.isStart = !this.isStart;
        luck.setStart(this.isStart); 
    }
}
