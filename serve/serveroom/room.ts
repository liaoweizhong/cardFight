// import express from 'express';
// import * as expressWs from "express-ws"
// const appBase = express();
// appBase.listen(2333);

import { Server,WebSocket, RawData } from "ws"

import { v4 as uuidv4 } from 'uuid';

import objs from "../object/obj"

import { Card } from "../object/1";

/**
 * 服务器房间
 */
export class Room {

    // public ws: RoomWebSocket;

    public code: string;

    public users: Array<RoomUser> = [];

    public cards: Array<Card> = [];

    constructor (){
        // 创建通信频道
        // this.ws = this.createRoomWebSocket()
        // 生成唯一code
        this.code = "test-1234" || uuidv4();

        // this.sendBasicInUser()
    }

    start (){
        
    }

    // // 创建连接
    // createRoomWebSocket(): RoomWebSocket{
    //     // 创建ws联结者
    //     const ws =  new RoomWebSocket();
    //     return ws;
    // }

    // 创建用户
    createRoomUser (webSocket: WebSocket, json: any): RoomUser{
        const userId = json.userId;
        return new RoomUser(webSocket,userId);
    }

    // 添加用户进入房间
    addUser (webSocket: WebSocket, json: any){
        // 生成用户
        const roomuser = this.createRoomUser(webSocket, json)
        // 添加到用户管理
        this.users.push(roomuser);
    }

    // 为房间内所有人发送基本信息
    sendAllUserBasicIn (){
        this.users.forEach((user)=>{
            // user.send(this.getBasicInformation());
            this.sendUserBasicInfo(user.id);
        })
    }

    sendUserBasicInfo (userId: string){
        // 首先获取当前用户
        const user = this.getUserById(userId);
        if( user ){
            user.send(this.getBasicInformation());
        }
    }

    // 当前房间的基本信息整理
    getBasicInformation (): Object{
        return {
            // 卡牌对象
            card: this.getBasicCard(),
        }
    }

    // 当前卡的情况
    getBasicCard (){
        return this.cards.map((card)=>{ return card.getBasicInformation() })
    }

    getUserById (id: string){
        return this.users.find((user: RoomUser)=>{ return user.id === id })
    }

    setCards (cardIds: Array<string>, userId: string){
        let card;
        cardIds.forEach((cardId)=>{
            card = objs.get(cardId);
            if( card ){
                this.cards.push(new card({userId: userId}));
            }
        })
    }

}

/**
 * 房间中的用户
 */
export class RoomUser {

    // 用户的webSocket
    public WebSocket: WebSocket;

    // 用户id
    public id: string;

    constructor (WebSocket: WebSocket, id: string){
        this.WebSocket = WebSocket;
        this.id = id;
    }

    send (sendString: string | Object){
        if (this.WebSocket.readyState == 1) {
            const sendText = typeof sendString === "string" ? sendString : JSON.stringify(sendString);
            console.log(sendText);
            this.WebSocket.send(sendText);
        }
    }
}


/**
 * webSocket
 */
export class RoomWebSocket {

    public room: Array<Room> = [];
    
    public roomUsers: Array<RoomUser> = [];

    constructor (){

        console.log("开启websocket服务器");

        // 定义websocket服务器
        // const wsServer = expressWs.default(appBase);
        const wsServer = new Server({ port: 2333 });

        // 连接
        wsServer.on('connection', (websocket: WebSocket) => {
            // console.log("有用户添加了")
            // this.roomUsers.push(new RoomUser(websocket))

            websocket.on("message",(data: RawData)=>{
                // debugger;
                console.log("收到有用的信息", data);
                console.log("将收到的信息toString", data.toString());
                console.log("将收到的信息类型", typeof data.toString());
                

                const dataString = JSON.parse(data.toString());

                switch ( dataString.type ){
                    // 创建房间
                    case "createRoom": this.createUser(); break;
                    // 获取房间基本信息
                    case "getRoomBasic": this.getRoomBasic(dataString); break;
                    // 进入房间
                    case "inRoom" : this.inRoom(websocket,dataString); break;
                    // 创建角色
                    case "createUser": this.createUser(); break;
                    // 获取房间列表
                    case "getRooms" : this.getRooms(); break;
                }
            })
        });

    }

    // 获取一个房间的基本信息
    getRoomBasic (dataJson: any){
        // 获取当前房间号
        const room = this.getRoomById(dataJson.roomId)
        if( room ){
            // 那个用户需要当前房间基本信息
            room.sendUserBasicInfo(dataJson.userId);
        }
    }

    // 创建一个新的房间
    createRoom (){
        const room = new Room();
        this.room.push(room);
        return room;
    }

    // 进入到房间
    inRoom (WebSocket: WebSocket,json: any){
        // 首先查询到房间id
        const room = this.getRoomById(json.roomId);
        // 触发房间的人员添加反应
        if( room !== undefined ){
            room.addUser(WebSocket, json)
        }
    }

    createUser (): void{
        // return new RoomUser(this.);
    }

    getRoomById (roomId: string): Room | undefined{
        return this.room.find((e: Room)=>{ return e.code === roomId })
    }

    getRooms (){
        
    }

    // 测试流程
    testProcess (){
        // 新建房间
        const room = this.createRoom();

        // 将卡牌预加载进入房间中
        room.setCards(["1","1","1","1","1"], "1");

        room.setCards(["1","1","1","1","1"], "2");
    }

}