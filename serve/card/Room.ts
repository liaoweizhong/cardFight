import { Player } from "./Player"
import { Card } from "./Cards/card";
import { Room } from "../webSocket/ws"
import { WebSocket } from "ws"


// 房间内的用户
export class CardsRoom extends Room {

    // 用户成员
    public players: Array<Player> = [];

    // 构造函数
    constructor (id: String){
       super(id); 
    }

    // 接收到信息
    toSend (dataJson: any, webSocket: WebSocket){
        super.toSend(dataJson, webSocket);

        return new Promise(()=>{
            // 获取请求事件
            let fnName = dataJson.fnName;
            switch ( fnName ){
                // 创建房间
                case "createPlayer": this.createPlayer(dataJson, webSocket); break;
            }
        })
    }

    // 创建用户
    createPlayer (dataJson: any, webSocket: WebSocket){
        // 根据传入的用户id创建用户
        if( dataJson.userId ){
            let player = new Player(dataJson.userId, this, webSocket);
            this.setPlayer(player);

            // player.send({},dataJson.mesCode);

            if( this.players.length == 2 ) {
                this.startGame();
            }
        }
    }

    // 开始游戏
    startGame (){
        // 开始游戏
        this.beginGame().then(()=>{
            // 开始游戏数据加载完毕后
            // 首先全员发送手牌
            this.getHandCard().then(()=>{
                // 全员发手牌之后  进入到连锁
                // 开始谁的回合
                this.startTime(this.players[0]);
            })
        });
    }

    // 添加用户
    public setPlayer(player: Player){
        this.players.push(player);
    }

    // 通知开始游戏
    public beginGame (){
        return Promise.all(this.players.map((player)=>{ return player.beginGame() }))
    }

    // 双方开始发放手牌
    public getHandCard (){
        return new Promise<void>((resolve)=>{
            const players1 = this.players[0];
            const players2 = this.players[1];
            players1.drawCard().then(()=>{
                players1.drawCard().then(()=>{
                    players1.drawCard().then(()=>{
                        players1.drawCard().then(()=>{
                            players2.drawCard().then(()=>{
                                players2.drawCard().then(()=>{
                                    players2.drawCard().then(()=>{
                                        players2.drawCard().then(()=>{
                                            resolve();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
                return;
            })
        })
    }

    start (player: Player){
        this.startTime(player).then(()=>{
            // 结束之后 切换成另一个来重复开始回合
            const newplayer = this.players.find((e)=>{ return e !== player });
            if( newplayer ){
                // 递归开始
                this.startTime(newplayer);
            }
        })
    }

    // 谁的回合
    startTime (player: Player){
        
        return new Promise<void>((resolve)=>{

            // 首先判断玩家是否需要触发回合开始前的卡
            this.timeBeforeCards().then(()=>{

                // 首先抽个卡
                player.drawCard().then(()=>{
                    
                    // 首先判断玩家是否需要触发回合开始前的卡
                    this.timeAfterCards().then(()=>{

                        // 等待操作
                        this.waitOpt(player).then(()=>{

                            // 操作完毕的话就执行回合结束
                            resolve();

                        });

                    })

                })

            });
            
        })

    }

    // 等待操作
    waitOpt (player: Player){
        return new Promise((resolve)=>{
            
        })
    }

    // 回合开始前处理
    timeBeforeCards (){
        return new Promise<void>((resolve)=>{

            // 首先检查一下双方玩家的所有卡牌  有没有要对现在的情况做处理的
            const player1 = this.players[0]; 
            const player2 = this.players[1];
            const cards1 = player1.getAllCards().filter((card)=>{ return card.isBeforeTime(this) });
            const cards2 = player2.getAllCards().filter((card)=>{ return card.isBeforeTime(this) });
            
            // 创建连锁
            this.createChain([cards1, cards2]).then(()=>{
                resolve();
            });

        })
    }

    // 回合开始抽卡后处理
    timeAfterCards (){
        return new Promise<void>((resolve)=>{

            // 首先检查一下双方玩家的所有卡牌  有没有要对现在的情况做处理的
            const player1 = this.players[0]; 
            const player2 = this.players[1];
            const cards1 = player1.getAllCards().filter((card)=>{ return card.isAfterTime(this) });
            const cards2 = player2.getAllCards().filter((card)=>{ return card.isAfterTime(this) });
            
            // 创建连锁
            this.createChain([cards1, cards2]).then(()=>{
                resolve();
            });

        })
    }

    useCard (card: Card){
        return new Promise<void>((resolve)=>{
            this.useCardBefore()
            // 使用卡牌之前
            card.use();
        })
    }

    // 在使用卡牌之前
    useCardBefore (){
        return new Promise<void>((resolve)=>{
            // 首先检查一下双方玩家的所有卡牌  有没有要对现在的情况做处理的
            const player1 = this.players[0]; 
            const player2 = this.players[1];
            const cards1 = player1.getAllCards().filter((card)=>{ return card.isBeforeUse(this) });
            const cards2 = player2.getAllCards().filter((card)=>{ return card.isBeforeUse(this) });
            
            // 创建连锁
            this.createChain([cards1, cards2]).then(()=>{
                resolve();
            });
        })
    }

    // 在使用卡牌之前
    useCardAfter (){
        return new Promise<void>((resolve)=>{
            // 首先检查一下双方玩家的所有卡牌  有没有要对现在的情况做处理的
            const player1 = this.players[0]; 
            const player2 = this.players[1];
            const cards1 = player1.getAllCards().filter((card)=>{ return card.isAfterUse(this) });
            const cards2 = player2.getAllCards().filter((card)=>{ return card.isAfterUse(this) });
            
            // 创建连锁
            this.createChain([cards1, cards2]).then(()=>{
                resolve();
            });
        })
    }

    // 处理触发卡组的连锁
    createChain (cards: Array<Array<Card>>, index: number = 0){

        return new Promise<void>((resolve)=>{

            // 初始准备工作 用来连锁用的卡
            this.ChainGetCards(cards, index).then((cards: Array<Card>)=>{

                // 将连锁的卡牌进行使用
                this.ChainUseCards(cards).then(()=>{

                    // 连锁
                    resolve();

                });

            });

        })

    }

    // 使用卡牌
    ChainUseCards (cards: Array<Card>, end?: any){
        return new Promise<void>((resolve)=>{
            const card = cards.shift();
            // 判断是否有卡牌
            if( !card ) {
                // 没有的话 就执行结束
                if( end ){
                    end();
                    resolve();
                }else{
                    resolve();
                }
            }else{
                // 使用第一张卡 // 将当前使用的卡从卡池中删掉
                this.useCard(card).then(()=>{
                    this.ChainUseCards(cards, resolve);
                });
            }
        })
    }

    // 获取连锁卡
    ChainGetCards (cards: Array<Array<Card>>, index: number = 0, isQuit: Boolean = false){
        
        const refCards:Array<Card> = [];

        return new Promise<Card[]>((resolve)=>{
            // 当前要触发的卡组
            const cardArray = cards[index%cards.length];
            // 判断一下是否还存在
            if( cardArray[0] ){
                // 问一下用户要触发什么
                const player = this.getCardFromPlayer(cardArray[0]);
                if( player ){
                    // 调用选择
                    player.selectCards(cardArray).then((card: Card | undefined)=>{
                        if( card !== undefined ){
                            // 选择的card要从数组里出去
                            cardArray.splice(cardArray.indexOf(card), 1);
                            refCards.push(card);
                            isQuit = false;
                        }else{
                            isQuit = true;
                        }

                        // 如果这个数组已经不存在可以触发的卡
                        // 试试看另一个还有吗
                        if( cards[(index+1)%cards.length][0] ){
                            // 要是存在的话 递归执行
                            this.ChainGetCards(cards, index+1, isQuit);
                        }else{
                            // 要是另一个也没有就完成连锁
                            resolve(refCards);
                        }
                    });
                }
            }else {
                // 如果这个数组已经不存在可以触发的卡
                // 试试看另一个还有吗  并且之前也不是放弃
                if( cards[(index+1)%cards.length][0] && !isQuit ){
                    // 要是存在的话 递归执行
                    this.ChainGetCards(cards, index+1, isQuit);
                }else{
                    // 要是另一个也没有就完成连锁
                    resolve(refCards);
                }
            }
        })
    }


    // 判断这个卡是那个玩家的
    getCardFromPlayer (card: Card){
        return this.players.find((player)=>{
            return player.getAllCards().indexOf(card) > -1;
        })
    }

}


export const test = function(){

    // // 创建一个房间
    // const room = new CardsRoom();

    // // 创建2个玩家
    // const player1 = new Player();
    // const player2 = new Player();

    // // 将玩家添加进入房间
    // room.setPlayer(player1);
    // room.setPlayer(player2);

    // // 开始游戏
    // room.beginGame().then(()=>{
    //     // 开始游戏数据加载完毕后
    //     // 首先全员发送手牌
    //     room.getHandCard().then(()=>{
    //         // 全员发手牌之后  进入到连锁
    //         // 开始谁的回合
    //         room.startTime(player1)
    //     })
    // });

}

export const load = function(id: String){
    // test();
    // 创建模块房间
    return new CardsRoom(id);
}