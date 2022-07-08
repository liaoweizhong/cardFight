import { Player } from "../Player";
import { Room } from "../Room";
import { Chaoliumeihai } from "./1";

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
    }

    // 回合开始的时候触发
    isBeforeTime (room: Room){
        return false;
    }

    // 回合开始的时候触发
    isAfterTime (room: Room){
        return false;
    }

    isBeforeUse (room: Room){
        return false;
    }

    isAfterUse (room: Room){
        return false;
    }

    // 使用卡
    use (){

    }

}