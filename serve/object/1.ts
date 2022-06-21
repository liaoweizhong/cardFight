/**
 * 测试人物
 */

import { RoomUser } from "../serveroom/room";
import { DataValue } from "./util/util1"

export class Card {

    public static id: string = '1';

    public id: string = '1';

    public userId: string;

    // 血量
    public Hp: DataValue = new DataValue();

    // 蓝量
    public Mp: DataValue = new DataValue();

    // 防御
    public Def: DataValue = new DataValue();

    // 精神
    public Spf: DataValue = new DataValue();

    // 初始化
    constructor (param: any){        
        // 用户id
        this.userId = param.userId;
    }

    // 获取自己的基本情况  用来进行前端渲染
    getBasicInformation (): Object{
        return {
            id: this.id,
            Hp: this.Hp.value,
            Mp: this.Mp.value,
            Def: this.Def.value,
            Spf: this.Spf.value,
            userId: this.userId
        }
    }

}