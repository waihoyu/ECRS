//创建express程序

var express = require('express')
var mongoose = require("mongoose")
var session = require("express-session")

var app = express()

mongoose.connect("mongodb://localhost/ecrs")
app.use(session({
    secret: 'test',
    cookie: {maxAge:6000},
    resave: false,
    saveUninitialized: true
}))

app.set("view engine","ejs")

// app.get("/",function (request,response) {
//     response.send("你好")
// })

app.use(express.static("public"))

//设置404页面
app.use(function (req,res) {
    res.send("你好，你访问的页面不存在")
})

app.listen(5000)
console.log("程序已经运行在5000端口");

