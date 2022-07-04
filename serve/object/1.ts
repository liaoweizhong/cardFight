/**
 * 测试人物
 */
import { v4 as uuidv4 } from 'uuid';
import { RoomUser, Room } from "../serveroom/room";
import { DataValue } from "./util/util1"

export class Card {

    public room: Room;

    public static id: string = '1';

    public id: string = '1';

    public code: String;

    public user: RoomUser;

    // 所在地区 0 手牌 1 前场 2 后场 3 墓地
    public areaCode: string = "0";

    // 血量
    public Hp: DataValue = new DataValue();

    // 蓝量
    public Mp: DataValue = new DataValue();

    // 防御
    public Def: DataValue = new DataValue();

    // 精神
    public Spf: DataValue = new DataValue();

    // 初始化
    constructor (user: RoomUser, room: Room){
        // 用户id
        this.user = user;
        // 随机code
        this.code = uuidv4();
        // 当前房间
        this.room = room;
    }

    // 获取自己的基本情况  用来进行前端渲染
    getBasicInformation (): Object{
        return {
            id: this.id,
            Hp: this.Hp.value,
            Mp: this.Mp.value,
            Def: this.Def.value,
            Spf: this.Spf.value,
            userId: this.user.id
        }
    }

    // 运行使用
    run (){
        // 普通召唤
        this.summon()
    }

    // 召唤
    summon (){
        const cards = this.user.cards;
        // 删除掉手牌
        cards.splice(cards.indexOf(this), 1);
        // 询问一下连锁
        this.searchChain("summon");
    }

    searchChain (chainType: string){
        this.room.chain(chainType);
    }

    chain (type: string){
        
    }

}