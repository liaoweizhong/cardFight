import express from 'express'; //1
// const serverConfig = require('../../server.config');
// 引入body-parser模块

import bodyParser from 'body-parser';

// 存储服务器实例对象集合
const appServerArray:Array<expressServer> = new Array();

export function getAppServerArray(){

    return appServerArray[0];

};

export function expressAnnotation ( AppServer: any ){

    // 创建一个新的服务器对象
    let appServer:expressServer = new AppServer(()=>{});

    // 创建一个express对象
    let app = express();
    // 支持跨域 //req, res, next
    app.all('*', function ( req: any , res: any, next: any ) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        res.header('Access-Control-Allow-Methods', '*');
        // res.header('Content-Type', 'application/json;charset=utf-8');
        // res.header('Content-Type', 'text/html;charset=utf-8');
        next();
    });

    // 支持静态访问路径
    app.use(express.static(__dirname.split("src")[0]+"src"));

    // 配置body-parser模块
    app.use(bodyParser.urlencoded({limit: '500mb', extended: false }));
    app.use(bodyParser.json({limit: '500mb'}));
    // app.use(express.json())
    
    // 注册服务
    appServer.setExpress(app);

    appServerArray.push(appServer);

}


export class expressServer {

    // 服务器ip
    public ip: String = "0.0.0.0";

    // 服务器端口
    public port: String = '9001';

    // 获取express实例化对象
    public newExpress: any;

    public listenBefore ( app: any ){
        
    }

    // 导入express实例
    public setExpress ( app: any ){
        this.newExpress = app;

        this.listenBefore(app);

        app.listen(this.port);

        console.log("---------------------------")
        console.log("成功开启服务器：")
        console.log(this.ip + ":" + this.port);
        console.log("---------------------------")
    }

}

