import { Server,WebSocket, RawData } from "ws"

import { Room } from "../serveroom/room";

/**
 * webSocket
 */
 export class RoomWebSocket {

    public room: Array<Room> = [];

    constructor (){

        console.log("开启websocket服务器");

        // 定义websocket服务器
        // const wsServer = expressWs.default(appBase);
        const wsServer = new Server({ port: 233 });

        // 连接
        wsServer.on('connection', (websocket: WebSocket) => {
            // console.log("有用户添加了")
            // this.roomUsers.push(new RoomUser(websocket))

            websocket.on("message",(data: RawData)=>{
                // debugger;
                console.log("将收到的信息toString", data.toString());
                console.log("将收到的信息类型", typeof data.toString());
                

                const dataString = JSON.parse(data.toString());

                console.log("将收到的信息请求", dataString.type);
                switch ( dataString.type ){
                    // 创建房间
                    // case "createRoom": this.createUser(); break;
                   
                }
            })
        });

    }

    // 测试流程
    testProcess (){
        // 新建房间
        // const room = this.createRoom();

        // 将卡牌预加载进入房间中
        // room.setCards(["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"], "1");

        // room.setCards(["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"], "2");

    }

}