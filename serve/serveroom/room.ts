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
        this.code = "test" || uuidv4();

        // this.sendBasicInUser()
    }

    start (){
        // 将为玩家都进入了链接 开始的游戏逻辑

        // 双方开始进入手牌抽卡流程
        this.userGetHeaderCards()
    }

    // 用户敞开获取手牌的逻辑
    userGetHeaderCards (){
        this.users.forEach((user)=>{
            // 抽4张牌
            user.drawCard();
            user.drawCard();
            user.drawCard();
            user.drawCard();
        })
    }

    // 创建用户
    createRoomUser (webSocket: WebSocket, json: any): RoomUser{
        const userId = json.userId;
        const user = new RoomUser(webSocket,userId)
        // 注入卡池
        user.setCards(json.cards);
        return user;
    }

    // 添加用户进入房间
    addUser (webSocket: WebSocket, json: any){
        // 生成用户
        const roomuser = this.createRoomUser(webSocket, json)
        // 添加到用户管理
        this.users.push(roomuser);
        // 告诉用户已经进入房间
        roomuser.send({ message: "已经加入成功", to: json.mesCode });

        // 如果用户超出2位的时候 开始游戏
        if( this.users.length == 1 ){
            // 开始游戏
            this.start()
        }
    }

    // 获取用户当前手牌的信息
    sendUserHeaderCards (userId: string, json: any){
        // 首先获取当前用户
        const user = this.getUserById(userId);
        if( user ){
            user.send({data:user.getUserHeaderCards(), to: json.mesCode});
        }
    }

    // 获取房间信息
    sendUserBasicInfo (userId: string, json: any){
        // 首先获取当前用户
        const user = this.getUserById(userId);
        if( user ){
            user.send({data:this.getBasicInformation(), to: json.mesCode});
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

    // 牌堆
    public cards: Array<any> = [];

    // 墓地
    public cemeteryCards: Array<any> = [];

    // 手牌
    public headerCards: Array<any> = [];

    constructor (WebSocket: WebSocket, id: string){
        this.WebSocket = WebSocket;
        this.id = id;
        // 所有卡的信息
        this.cards = [];
        // 当前手牌的信息
        this.headerCards = [];
    }

    send (sendString: string | Object){
        if (this.WebSocket.readyState == 1) {
            const sendText = typeof sendString === "string" ? sendString : JSON.stringify(sendString);
            console.log("sendText",sendText);
            this.WebSocket.send(sendText);
        }
    }

    // 获取用户当前手牌的信息
    getUserHeaderCards (){
        
    }

    // 加载cards
    setCards (cardsId: Array<string>){
        let i;
        // 将数组id转化为对应对象
        this.cards = cardsId.map((e)=>{ 
            i = objs.get(e);
            return i ? new i({ user: this.id }) : null;
        });
    }

    // 抽牌
    drawCard (){
        // 随机下标
        const index = parseInt((Math.random()*this.cards.length).toString());
        // 随机抽出一个card数据
        const card = this.cards.splice(index,1)
        // 将卡牌加入手牌
        this.addHeaderCards(card[0]);
        // 抽卡对象
        return card;
    }

    // 将卡牌加入手牌
    addHeaderCards (card: any){
        // 添加这手牌中的
        this.headerCards.push(card);

        // 抽卡
        this.send({ to: "sendAddHeaderCard", cardsId: card.id, cardsCode: card.code })
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
                console.log("将收到的信息toString", data.toString());
                console.log("将收到的信息类型", typeof data.toString());
                

                const dataString = JSON.parse(data.toString());

                console.log("将收到的信息请求", dataString.type);
                switch ( dataString.type ){
                    // 创建房间
                    case "createRoom": this.createUser(); break;
                    // 获取房间基本信息
                    case "getRoomBasic": this.getRoomBasic(dataString); break;
                    // 获取当前手牌信息
                    case "getHeaderCards": this.getHeaderCards(dataString); break;
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

    // 用户获取手牌信息
    getHeaderCards (dataJson: any){
        // 获取当前房间号
        const room = this.getRoomById(dataJson.roomId)
        if( room ){
            // 那个用户需要当前手牌信息
            room.sendUserHeaderCards(dataJson.userId, dataJson);
        }
    }

    // 获取一个房间的基本信息
    getRoomBasic (dataJson: any){
        // 获取当前房间号
        const room = this.getRoomById(dataJson.roomId)
        if( room ){
            // 那个用户需要当前房间基本信息
            room.sendUserBasicInfo(dataJson.userId, dataJson);
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
            // 添加房间
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
        // room.setCards(["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"], "1");

        // room.setCards(["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"], "2");

    }

}