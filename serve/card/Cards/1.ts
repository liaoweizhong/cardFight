import { Player } from "../Player";
import { CardsRoom } from "../Room";
import { Card } from "./card";

export class Chaoliumeihai extends Card {

    static id = "1"
    public id = "1"

    // 构造函数
    constructor (player: Player){
        super(player);
    }

    // 开始回合之前触发
    public isBeforeTime (room: CardsRoom){
        return false;
    }

    // 使用卡
    use (){

    }

}