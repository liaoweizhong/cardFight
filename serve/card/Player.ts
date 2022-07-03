import { Chaoliumeihai } from "./Cards/1";
import { Card } from "./Cards/card";

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
            resolve();
        })
    }

    // 从墓地中抽卡
    public drawCard (){
        return new Promise<void>((resolve)=>{
            const cards = this.cards.shift();
            if( cards ){
                this.handCards.push(cards);
            }
            resolve();
        })
    }

    // 获取全部卡牌
    public getAllCards (){
        return this.cards.concat(this.handCards).concat(this.cemeteryCards).concat(this.afterCards).concat(this.beforeCards);
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

}