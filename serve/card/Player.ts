import { Chaoliumeihai } from "./Cards/1";
import { Card } from "./Cards/card";
import { CardsRoom } from "./Room";
import { WebSocket } from "ws"
import { v4 as uuidv4 } from 'uuid';


const Cards: Array<any> = [Chaoliumeihai];

// 房间内的用户
export class Player {

    // 卡牌cardsId
    public cardsId: Array<string> = ["1","1","1","1","1","1","1","1","1","1"];

    // 牌堆
    public cards: Array<Card> = [];

    // 手牌
    public handCards: Array<Card> = [];

    // 墓地
    public cemeteryCards: Array<Card> = [];

    // 前场
    public beforeCards: Array<Card> = [];

    // 后场
    public afterCards: Array<Card> = [];

    // 房间
    public room: CardsRoom;

    // 玩家的ws
    public webSocket: WebSocket;

    // 当前玩家id
    public id: String = "";

    constructor (id: String ,room: CardsRoom, webSocket: WebSocket){
        this.id = id;
        // 当前房间
        this.room = room;
        // 当前用户的
        this.webSocket = webSocket;
    }

    // 将卡牌加入到牌堆
    public addcards (card: Card){
        this.cards.push(card);
    }

    // 将卡牌加入到手牌中
    public addHandCards (card: Card){
        this.handCards.push(card);
    }

    // 将卡牌加入到墓地
    public addCemeteryCards (card: Card){
        this.cemeteryCards.push(card);
    }

    // 将卡牌加入到前场
    public addBeforeCards (card: Card){
        this.beforeCards.push(card)
    }

    // 将卡牌加入到后场
    public addAfterCards (card: Card){
        this.afterCards.push(card)
    }

    // 开始游戏
    public beginGame (){
        return new Promise<void>((resolve)=>{
            // 将保存的cardid转化为卡牌实例
            this.cards = this.cardsId.map((id)=>{
                return new (this.getCardsById(id))(this);
            })
            // 请求前端渲染加载数据
            this.send({ fnName: "loadInitCards" , cards: this.cards.map((e)=>{ return { id: e.id, xid: e.xid } }) }).then(()=>{
                // 页面加载卡牌数据完毕后
                resolve();
            })
        })
    }

    // 从卡组中抽卡
    public drawCard (){
        return new Promise<void>((resolve)=>{
            const cards = this.cards.shift();
            if( cards ){
                this.handCards.push(cards);
                // 传值抽卡
                this.send({fnName: "drawCard", cardId: cards.id, xid: cards.xid}).then(()=>{
                    // 客户端渲染成功后
                    resolve();
                });
            }else {
                resolve();
            }
        })
    }

    // 获取全部卡牌
    public getAllCards (){
        return this.cards.concat(this.handCards).concat(this.cemeteryCards).concat(this.afterCards).concat(this.beforeCards);
    }

    // 根据xid获取卡牌
    public getCardsByXid (xid: String){
        const cards = this.cards.concat(this.handCards).concat(this.cemeteryCards).concat(this.afterCards).concat(this.beforeCards);
        return cards.find((e)=>{ return e.xid == xid });
    }

    // 用户选择卡
    public selectCards (cards: Array<Card>){
        return new Promise<Card>((resolve)=>{
            resolve(cards[0]);
        })
    }

    public getCardsById (id: string){
        return Cards.find((card)=>card.id == id) || Cards[0];
    }

    // 使用卡 send调用的
    public sendUseCard (data: any){
        // 获取使用的卡id
        const cardxid = data.sendData.xid;
        // 从全部卡组中查询实体卡对象
        const card = this.getCardsByXid(cardxid);
        if( card ){
            // 使用图片
            this.room.useCard(card)
        }
    }

    public send (sendString: string | Object, fromCode?: string){
        if (this.webSocket.readyState == 1) {
            // 生成当前通信的唯一值
            const code = uuidv4();
            // sendObj
            const sendObj = {
                id: this.id,
                code: code,
                sendData: typeof sendString === "string" ? JSON.parse(sendString) : sendString,
                from: fromCode
            }
            // 请求访问
            this.webSocket.send(JSON.stringify(sendObj));
            // 然后生成返回回调
            return new Promise<void>((resolve)=>{
                this.room.cacheResovle.push({
                    "code": code,
                    "resolve": resolve
                })
            })
        }

        return new Promise<void>((resolve)=>{
            resolve()
        })
    }

}