// 测试人物
import { Card } from "./1";

export default {

    Objects: [Card],

    get (id: string){
        return this.Objects.find((card)=>{ return card.id == id });
    },

}


