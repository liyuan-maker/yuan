var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", (req, res) => {
    console.log("收到请求了")
    res.sendFile(__dirname + '/index.html');
})
io.on("connection", socket => {
    var roomId = "some room";
    // 加入房间
    socket.on("join", data => {
        socket.join(roomId);
        io.sockets.in(roomId).emit('system', data + '加入了房间');//包括自己
    }); 
    //离开房间;
    socket.on('leave', function (data) {
        //用户离开房间
       // console.log(data);
        socket.leave(roomId);
        //向此用户发送信息
        socket.emit('leavehint', data + '离开了房间')
    });
    socket.on("message", function (obj) {
        //对消息处理；广播出去；
        io.emit("message", obj);//obj,发送消息给所有已连接的客户端；

    });
    socket.on('disconnect', function () {
        io.emit('user disconnected');
    });
})
http.listen(5500, () => {
    console.log("the server on localhost:5500");
})