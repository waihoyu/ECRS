
let formidable = require('formidable')
let path = require("path")
let fs = require("fs")
let xlsx = require("node-xlsx")

exports.showAdminDashborad = function (req,res) {
    res.render("admin/index",{
        page : "index"
    });
}

exports.showStudent = function (req,res) {
    res.render("admin/student",{
        page : "student"
    });
}

exports.showCourse = function (req,res) {
    res.render("admin/course",{
        page : "course"
    });
}

exports.showReport = function (req,res) {
    res.render("admin/report",{
        page : "report"
    });
}

exports.showImport = function (req,res) {
    res.render("admin/student/import",{
        page : "report"
    });
}

exports.doImport = function (req,res) {
    let form = new formidable.IncomingForm()
    form.uploadDir = './uploads'
    form.keepExtensions = true
    form.parse(req,function (err,fields,files) {
        if ((path.extname(files.studentexcel.name) == ".xls")||(path.extname(files.studentexcel.name) == ".xlsx")){
            // res.send("文件类型上传成功！")
            let xmlfileContent = xlsx.parse("./"+files.studentexcel.path)
            if (xmlfileContent.length != 6){
                res.send("表格不合格！")
                return
            }
            for (let i = 0;i<6;i++){
                if (xmlfileContent[i].data[0][0] != "学号"||
                    xmlfileContent[i].data[0][1] != "姓名"||
                    xmlfileContent[i].data[0][2] != "性别"
                ){
                    res.send("缺少子表格表头")
                }
            }
            return
        }else {
            // 检查拓展名
            // res.send("对不起，上传的文件类型不正确")
            fs.unlink("./" + files.studentexcel.path,function (err) {
                if (err){
                    console.log("删除文件错误")
                    return
                }else{
                    console.log(files.studentexcel.path)
                    res.send("对不起，上传的文件类型不正确，已经从服务器上删除")
                    return
                }
            })

        }
    })
}

