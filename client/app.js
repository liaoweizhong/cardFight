const express = require('express'); 

const bodyParser = require('body-parser');

// 创建一个express对象
let app = express();
// 支持跨域 //req, res, next
app.all('*', function ( req , res, next ) {
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

app.listen(8000);

app.get("/",function(req,res){
    var options = {
        root: __dirname,    
        headers: {
          "Content-Type": "text/html"
        }
    }
    res.sendFile('index.html',options, function(error){ });
});

 console.log("---------------------------")
 console.log("成功开启服务器：")
 console.log("---------------------------")