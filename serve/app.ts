import { expressAnnotation , expressServer } from "./express/express"

import { RoomWebSocket } from "./serveroom/room"

@expressAnnotation
export class server extends expressServer {

    // 服务端口
    public port: String = "8881"

    public listenBefore (app: any){
        
        // 创建api文档页面
        // 记得在开发者环境中注释掉
        
        // 创建战斗房间管理
        const roomServer = new RoomWebSocket();


        // 测试流程
        roomServer.testProcess()

    }

}

(server)