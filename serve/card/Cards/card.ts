import { Player } from "../Player";
import { CardsRoom } from "../Room";
import { Chaoliumeihai } from "./1";
import { v4 as uuidv4 } from 'uuid';

export class Card {

    // 类id
    static id: string = "";

    // 实体id
    public id: string = "";

    // 实例id
    public xid: string = "";

    public player: Player;

    constructor (player: Player){
        this.player = player;
        this.xid = uuidv4();
    }

    // 回合开始的时候触发
    isBeforeTime (room: CardsRoom){
        return false;
    }

    // 回合开始的时候触发
    isAfterTime (room: CardsRoom){
        return false;
    }

    isBeforeUse (room: CardsRoom){
        return false;
    }

    isAfterUse (room: CardsRoom){
        return false;
    }

    // 使用卡
    use (){

    }

}