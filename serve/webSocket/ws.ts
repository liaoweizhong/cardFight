import { Server,WebSocket, RawData } from "ws"

import { v4 as uuidv4 } from 'uuid';
import { CardsRoom } from "../card/Room";

// import { Room } from "../serveroom/room";

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

            let dataString: any = {};

            let room: Room | undefined;

            websocket.on("message",(data: RawData)=>{
                // debugger;
                console.log("将收到的信息toString", data.toString());
                console.log("将收到的信息类型", typeof data.toString());
                

                dataString = JSON.parse(data.toString());

                console.log("将收到的信息请求", dataString.roomId);

                // 根据查询到的房间id定位房间
                room = Room.getRoomById(dataString.roomId);

                if( room ) {
                    room.toSend(dataString, websocket);
                }

            })

        });

        RoomWebSocket.ws = wsServer;

    }

    // 测试流程
    testProcess (){
        // 新建房间
        // const room = this.createRoom();

        // 将卡牌预加载进入房间中
        // room.setCards(["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"], "1");

        // room.setCards(["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"], "2");

    }

    static ws:Server;

}


export class Room {

    public roomId: String = "";

    // 存储的等待回复的scoket
    public cacheResovle: Array<any> = [];

    constructor (id: String){

        // 当前房间的id
        this.roomId = id || uuidv4();

        // 记录自己
        Room.Maps.push(this);

    }

    toSend (dataJson: any, webSocket: WebSocket){
        // 首先判断是否是带返回的
        if( dataJson.from ){
            const resovle = this.cacheResovle.find((e)=>{ return e.code == dataJson.from });
            this.cacheResovle.splice(this.cacheResovle.indexOf(resovle), 1);
            if( resovle.resolve ) resovle.resolve(dataJson);
        }
    }

    send (dataJson: any, webSocket: WebSocket){
        
    }

    static Maps: Array<Room> = [];

    static getRoomById(roomId: String) {

        return this.Maps.find((e)=>{ return e.roomId = roomId })

    }

}