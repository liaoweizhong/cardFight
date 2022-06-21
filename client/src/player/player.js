class Player {

    constructor (){

        // 用户id
        this.id = "1";

        // 连接通信对象
        this.ws = null;

        // 房间号码
        this.roomId = "";

        // 全部卡牌数据队列
        this.cardLists = [];

    }

    // 加入通信ws
    setWs (ws){
        this.ws = ws;
    }

    // 加入房间
    inRoom (roomId = "test"){
        this.roomId = roomId;
        // 加入房间
		return this.ws.sendJson({ type: "inRoom" , userId: "1", roomId: roomId }).then((res)=>{
            // 成功加入
            console.log("加入房间成功");
        });
    }

    // 获取当前房间基本数据
    getRoomBasic ( roomId = this.roomId ){
        return this.ws.sendJson({ type: "getRoomBasic" , userId: "1", roomId: roomId }).then((res)=>{
            this.cardLists = res.data.card;
            console.log("数据基本信息以获取")
        });
    }

    // 初始化加载卡牌数据
    loadCard (){
        this.cardObjectLists = this.cardLists.map((e)=> { return  })
    }

}