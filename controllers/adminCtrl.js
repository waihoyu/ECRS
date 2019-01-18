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
exports.showCoure = function (req,res) {
    res.render("admin/course",{
        page : "course"
    });
}
exports.showReport = function (req,res) {
    res.render("admin/report",{
        page : "report"
    });
}
