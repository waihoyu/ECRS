let formidable = require('formidable')
let path = require("path")
let fs = require("fs")
let xlsx = require("node-xlsx")
let Student = require("../models/Students")
let url = require("url")

exports.showAdminDashborad = function (req, res) {
    res.render("admin/index", {
        page: "index"
    });
}

exports.showStudent = function (req, res) {
    res.render("admin/student", {
        page: "student"
    });
}

exports.showCourse = function (req, res) {
    res.render("admin/course", {
        page: "course"
    });
}

exports.showReport = function (req, res) {
    res.render("admin/report", {
        page: "report"
    });
}

exports.showImport = function (req, res) {
    res.render("admin/student/import", {
        page: "report"
    });
}

exports.doImport = function (req, res) {
    let form = new formidable.IncomingForm()
    form.uploadDir = './uploads'
    form.keepExtensions = true
    form.parse(req, function (err, fields, files) {
        if ((path.extname(files.studentexcel.name) == ".xls") || (path.extname(files.studentexcel.name) == ".xlsx")) {
            // res.send("文件类型上传成功！")
            let xmlfileContent = xlsx.parse("./" + files.studentexcel.path)
            if (xmlfileContent.length != 6) {
                res.send("表格不合格！")
                return
            }
            for (let i = 0; i < 6; i++) {
                if (xmlfileContent[i].data[0][0] != "学号" ||
                    xmlfileContent[i].data[0][1] != "姓名"
                ) {
                    res.send("缺少子表格表头")
                    return
                }
            }
            Student.importStudent(xmlfileContent)
            res.send("上传成功！")
            return
        } else {
            // 检查拓展名
            // res.send("对不起，上传的文件类型不正确")
            fs.unlink("./" + files.studentexcel.path, function (err) {
                if (err) {
                    console.log("删除文件错误")
                    return
                } else {
                    console.log(files.studentexcel.path)
                    res.send("对不起，上传的文件类型不正确，已经从服务器上删除")
                    return
                }
            })

        }
    })
}

exports.getAllStudent = function (req, res) {
    Student.find({}, function (err, results) {
        res.send({"rows": results})
    })
}

//   /student?_search=false&nd=1491010477409&rows=10&page=4&sidx=sid&sord=asc&keyword=山

exports.getAllStudent2 = function (req, res) {

    let rows = parseInt(url.parse(req.url, true).query.rows)
    let page = url.parse(req.url, true).query.page
    let sidx = url.parse(req.url, true).query.sidx
    let sord = url.parse(req.url, true).query.sord
    let keyword = url.parse(req.url, true).query.keyword
    let sordNumber = sord == "asc" ? 1 : -1

    let findFiler = {}
    if (keyword === undefined || keyword == "") {
        findFiler = {}
    } else {
        let regexp = new RegExp(keyword, "g")
        findFiler = {
            $or: [
                {"sid": regexp},
                {"name": regexp},
                {"grade": regexp}
            ]
        }
    }
    Student.count(findFiler, function (err, count) {
        let total = Math.ceil(count / rows)
        let sortobj = {}
        sortobj[sidx] = sordNumber

        // Student.find({}).sort(sortobj).limit(rows).skip(rows * (page - 1)).exec(function (err, results) {
        //     res.json(
        //         {
        //             "records": count,
        //             "page": page,
        //             "total": total,
        //             "rows": results
        //         })
        //
        //     // console.log(err)
        //     // res.send({"rows":results})
        // })
        Student.find(findFiler).sort(sortobj).limit(rows).skip(rows * (page - 1)).exec(function (err, results) {
            console.log(results)
            res.json(
                {
                    "records": count,
                    "page": page,
                    "total": total,
                    "rows": results
                })
        })
    })
}

exports.updateStudent = function (req, res) {
    let sid = parseInt(req.params.sid)
    let form = new formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
        let key = fields.cellname
        let value = fields.value
        Student.find({"sid": sid}, function (err, results) {
            if (err) {
                res.send({"result": -2})
                return
            }
            if (results.length == 0) {
                res.send({"result": -1})
                return
            }
            let thestudent = results[0]
            thestudent[key] = value
            thestudent.save()
            res.send({"result": 1})
        })
    })
}

exports.studentJSON = function (req, res) {
    Student.find({}, function (err, results) {
        console.log(results)
        res.send(results)
    })
}

exports.showAdminStudentAdd = function (req, res) {
    res.render("admin/student/add", {
        page: "add"
    })
}

exports.addStudent = function (req, res) {
    let form = new formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
        let sid = fields.sid
        if (!/^[\d]{9}$/.test(sid)) {
            res.send({"result":-2})
            return
        }

        Student.count({"sid":sid},function (err,count) {
            if (err){
                res.json({"result":-1})
                return
            }
            if (count != 0){
                res.json({"result":-3})
                return
            }
        })

        var nameTxt = fields.name
        if (!/^[\u4E00-\u9FA5]{2,5}(?:.[\u4E00-\u9FA5]{2,5})*$/.test(nameTxt)){
            res.send({"result":-5})
            return
        }

        // var nameTxt = fields.name
        // if (/^[\u4E00-\u9FA5]{2,5}(?:.[\u4E00-\u9FA5]{2,5})*$/.test(nameTxt)){
        //     invalid.name = false
        //     $(this).successTip("合法")
        // }else {
        //     invaild.name = true
        //     $(this).dangerTip("没有通过正则验证，必须合法中文")
        // }

        let s = new Student({
            sid             :fields.sid,
            name            :fields.name,
            grade           :fields.grade,
            password        :fields.password
        })
        s.save(function (err) {
            if (err){
                res.join({"result":-1})
                return
            }
            res.join({"result":-1})
        })
    })
}

//propfind类型接口，检查学生是否存在
exports.checkStudentExist = function (req, res) {
    let sid = parseInt(req.params.sid)
    if (!sid){
        res.json({"result":-1})
        return
    }
    Student.count({"sid":sid},function (err,count) {
        if (err){
            res.json({"result":-1})
            return
        }
        res.json({"result":count})
    })
}
