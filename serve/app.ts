import { expressAnnotation , expressServer } from "./express/express"

import { RoomWebSocket } from "./webSocket/ws"

import { load } from "./card/Room";

@expressAnnotation
export class server extends expressServer {

    // 服务端口
    public port: String = "8882"

    public listenBefore (app: any){
        
        // 创建api文档页面
        // 记得在开发者环境中注释掉
        
        // 创建战斗房间管理
        const roomServer = new RoomWebSocket();

        // 加载卡牌战斗房间系统
        load();

    }

}

(server)