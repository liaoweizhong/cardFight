// 用户
export class Player {

    // 用户的webSocket
    // public WebSocket: WebSocket;

    // 用户id
    public id: string;

    // 牌堆
    public cards: Array<any> = [];

    // 墓地
    public cemeteryCards: Array<any> = [];

    // 手牌
    public headerCards: Array<any> = [];

    // 场地
    public spaceCards: Array<any> = [];

    // 后场
    public coverCards: Array<any> = [];

    // 构造函数
    constructor (id: string){
        // this.WebSocket = WebSocket;
        this.id = id;
        // 所有卡的信息
        this.cards = [];
        // 当前手牌的信息
        this.headerCards = [];
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
    }

    // 使用卡
    useCard (cardCode: string){
        // 获取当前卡的实体对象
        const card = this.getCardByCode(cardCode);
        // 执行卡对象
        card.run()
    }

    // 根据code获取实体
    getCardByCode (cardCode: string){
        let card = this.cards.find((e)=>{ return e.code == cardCode });
        // card || (card = this.cemeteryCards.find((e)=>{ return e.cemeteryCards == cardCode }))
        return card;
    }

}


// 房间
export class Room {

    public users: Array<Player> = [];

    constructor (){

        // 等待加入

        // 开始
        
    }

    // 加入
    setPlayer (player: Player){
        this.users.push(player);
        // 注入卡池
        // player.setCards(["1","1","1","1","1","1","1","1","1","1"]);
    }

    // 双方抽卡
    start (){
        // 双方抽
        this.userGetHeaderCards();
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

}



// 创建房间
const room = new Room();

// 加入人员
room.setPlayer( new Player("1") );
room.setPlayer( new Player("2") );

// 确定人员之后 开启
room.start();