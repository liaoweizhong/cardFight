class Player {

    constructor (param={}){

        // 用户id
        this.id = param.userId;

        // 连接通信对象
        this.ws = null;

        // 房间号码
        this.roomId = "";

        // 全部卡牌数据队列
        this.cardLists = [];

        // 手牌对象
        this.headerObject = null;

    }

    // 加入通信ws
    setWs (ws){
        this.ws = ws;
    }

    // 加入房间
    inRoom (roomId = "test"){
        this.roomId = roomId;
        // 加入房间
		return this.ws.sendJson({ fnName: "createPlayer" , userId: this.id, roomId: roomId, cards: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] }).then((res)=>{
            // 成功加入
            console.log("加入房间成功");
        });
    }

    // 获取当前房间基本数据
    getRoomBasic ( roomId = this.roomId ){
        return this.ws.sendJson({ type: "getCards" , userId: this.id, roomId: roomId }).then((res)=>{
            this.cardLists = res.data.card;
            console.log("数据基本信息以获取")
        });
    }

    // 初始化加载卡牌数据
    loadInitCards (data){

        // 获取后台传入的卡组id
        const cards = data.sendData.cards;

        this.cardLists = cards;

        this.cardObjectLists = this.cardLists.map((e)=> { 
            return new (Card.get(e.id))({ userId: this.id, xid: e.xid });
        });

        // 回复信息
        this.ws.sendJson({ roomId: this.roomId, userId: this.id, from: data.code});

    }

    // 获取手牌信息
    getHeaderCards (roomId = this.roomId){
        return this.ws.sendJson({ type: "getHeaderCards" , userId: this.id, roomId: roomId }).then((res)=>{
            // this.cardLists = res.data.card;
            console.log("获取手牌信息", res)
        });
    }

    // // 通信添加手牌
    // sendAddHeaderCard (sendJson){
    //     // 根据id创建对应的卡牌实体对象
    //     const card = new (Card.get(sendJson.cardsId))({ userId: this.id, code: sendJson.cardsCode });

    //     this.addHeaderCard(card);
    // }

    // // 添加一个手牌
    // addHeaderCard (card){
    //     this.headerObject.setCard(card);
    // }

    setShoupai (obj){
        this.headerObject = obj;

        obj.setPlayer(this);
    }

    // 使用卡牌的时候
    userCard (cards){
        return this.ws.sendJson({ type: "sendUseCard", userId: this.id, roomId: this.roomId, xid: cards.xid }).then((res)=>{
            // this.cardLists = res.data.card;
            console.log("使用成功", res)
        });
    }


    // 抽卡
    drawCard (data){
        debugger;

        // 根据id获取卡牌对象
        const card = this.cardObjectLists.find((e)=>{ return e.xid === data.sendData.xid });

        // 首先根据获取手牌对象
        this.headerObject.setCard(card);

        // 回复信息
        this.ws.sendJson({ roomId: this.roomId, userId: this.id, from: data.code});
    }

}