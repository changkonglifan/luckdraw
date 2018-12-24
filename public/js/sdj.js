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
        level2: 4,
        level3: 8
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
    console.log(round);
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
        this.level = 0;
        //前面奖项抽完
        // alert('抽奖已结束');
        // this.isEnd = true;
        // return;
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
    console.log(`${user.name}`)
    return user;
}
/**
 * 写入列表
 */
Sdj.prototype.renderPrizeList = function () { 
    let enumData = ['一等奖','二等奖','三等奖'];
    let str = `${enumData[this.level - 1]}:${this.currentPrize.name}`;
    if(this.level === 0){
        str = `${this.currentPrize.name}`;
    }
    this.userContainer.text(str);
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
    luck.setStart(this.isStart,false);//重新开始跑 
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
        //选择前二十个
        return index < 20;
    })
    //把中将人放到第十个
    filterData[9] = user;  
    return filterData;
}

/**
 * 重新设置获取中奖人后的跑马场 
 */
Sdj.prototype.getAfterPrize = function () {
    var lastTen = $('div[class*=active],div[class*=next]').text();
    var data = this.setData(shuffleData(this.lastUsr), this.currentPrize,lastTen);//之后的二十个数组
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
    $(html).insertAfter($('.next9'));
    this.isSpeedDown = true;//开始减速 
    luck.setStart(true,false); 
    luck.EasySlidesNext();
}
/**
 * 获取苹果下落时间
 * 从点击按钮开始减速
 */
Sdj.prototype.getAppleTimeout = function () {
    var timeout = 200 * 4 + 400 * 2 + 600 * 2 + 800 * 2 + 10 * 100;
    this.timeout = timeout;
}
/**
 * 跑马场跑圈回调
 */
Sdj.prototype.circleCallback = function () { 
    if (this.isSpeedDown){
        if (this.circleRun === 10) {
            luck.setSpeed(200);
            this.setEase(0.2);
        } else if (this.circleRun === 12) {
            luck.setSpeed(400);
            this.setEase(0.4);
        } else if (this.circleRun === 14) {
            luck.setSpeed(600);
            this.setEase(0.6);
        } else if (this.circleRun === 16) {
            luck.setSpeed(800);
            this.setEase(0.8);
        } else if (this.currentPrize.key + '' == $('.next1').attr('key').trim() && this.circleRun > 16) {
            //28个结束  
            this.resetSdj(); 
        }
        if (this.circleRun >= 20) {
            console.error('bug了');
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
    luck.setStart(this.isStart,false);
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
 * 从剩余中奖人中，获取二十个人插入最后
 * 减速到最后一个人
 */
Sdj.prototype.start = function () {
    if (this.isSpeedDown) { return; } 
    this.getAppleDown();//开始苹果下落 
    this.currentPrize = this.getPrize();//拿到中奖人
    if (!this.isEnd){   
        luck.setStart(false,true); 
        // this.getAfterPrize();
        
    }
}
