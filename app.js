
//创建express程序

let express = require('express')
let mongoose = require("mongoose")
let session = require("express-session")
let adminCtrl = require("./controllers/adminCtrl")

let app = express()

mongoose.connect("mongodb://localhost/ecrs")
app.use(session({
    secret:                 'test',
    cookie:                 {maxAge:6000},
    resave:                 false,
    saveUninitialized:      true
}))

app.set("view engine","ejs")

app.get("/"                             ,adminCtrl.showAdminDashborad)
app.get("/admin"                        ,adminCtrl.showAdminDashborad)
app.get("/admin/student"                ,adminCtrl.showStudent)
app.get("/admin/student/import"         ,adminCtrl.showImport)
app.post("/admin/student/import"        ,adminCtrl.doImport)
app.get("/admin/student/add"           ,adminCtrl.showAdminStudentAdd)
app.get("/admin/course"                 ,adminCtrl.showCourse)
app.get("/admin/report"                 ,adminCtrl.showReport)
app.get("/student"                      ,adminCtrl.getAllStudent2)
app.post("/student/:sid"                ,adminCtrl.updateStudent)
app.get("/studentJSON"                ,adminCtrl.studentJSON)

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
