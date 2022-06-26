class Caipan {
 
    constructor (){

        // 创建ws
        this.ws = this.createWs();

        // 用户各位
        this.player = null;

    }

    init (){

        // 所有用户进入房间
		this.inRoom();

        // 获取当前手牌情况
        // this.player.getHeaderCards();

    }

    // 将当前控制对象添加进入ws
    inRoom (){
        this.player.inRoom();
    }

    addPlayer (player){
        this.player = player;
        player.setWs(this.ws);
    }

    onload (){
        return new Promise((resovle)=>{
            this.onloadResovle = resovle;
        });
    }

    createWs (){
        // 打开一个 web socket，设定websocket服务器地址和端口
        var ws = new WebSocket("ws://127.0.0.1:2333");

        //开启连接open后客户端处理方法
        ws.onopen = ()=> {
            // 加入房间
            // player.inRoom();
            this.onloadResovle();
        };

        // 接收消息后客户端处理方法
        ws.onmessage = (evt) => { 
            console.log(evt.data);

            const data = JSON.parse(evt.data)

            // 判断一下是否有code记录
            if( ws.messageQueue[data.to] ){
                ws.messageQueue[data.to](data);
                delete ws.messageQueue[data.to];
            };

            // 过滤是否直接给与用户的
            if( this.player && this.player[data.to] ){
                this.player[data.to](data);
            }
        };
        
        // 关闭websocket
        ws.onclose = function()
        { 
        // 关闭 websocket
        alert("连接已关闭..."); 
        };

        ws.messageQueue = [];

        ws.sendJson = function(json){
            return new Promise((resovle)=>{
                // 生成唯一识别码
                const code = new Date()*1 +"_"+ Math.random().toString().replace("0.","");
                ws.messageQueue[code] = resovle;
                json.mesCode = code;
                this.send(JSON.stringify(json));
            })
        }

        return ws;
    }

}