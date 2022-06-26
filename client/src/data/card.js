// 卡牌基础对象
class Card {

    constructor (){
        // this.maps.push(this);
    }
    
    static maps = [];

    static get (id){
        return this.maps.find((e)=>{ return e.id === id });
    }
}