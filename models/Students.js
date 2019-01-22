let mongoose = require("mongoose")
let studentSchema = new mongoose.Schema({
    "sid"                       :Number,
    "name"                      :String,
    "sex"                       :String,
    "grade"                     :Number,
    "password"                  :String,
    "ChangedPassword"          :{type:Boolean,default:false}
})
studentSchema.statics.importStudent = function(xmlfileContent){
    let tag = 0
    let str = "ABCDEFGHIJKLNMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()"
    mongoose.connection.collection("students").drop(function () {
        try {
            for (let i = 0;i < 6;i++){
                for (let j = 1;j < xmlfileContent[i].data.length;j++){
                    // console.log(xmlfileContent[i].data[j][0])
                    let password = ""
                    for (let i = 0; i < 6;i++ ){
                        password += str.charAt(parseInt(str.length * Math.random()))
                    }
                    let s = new Student({
                        "sid":   xmlfileContent[i].data[j][0],
                        "name":  xmlfileContent[i].data[j][1],
                        "sex":   xmlfileContent[i].data[j][2]||"",
                        "grade": i + 1,
                        "password":  password
                    })
                    s.save()
                    // console.log(tag++)
                }
            }
        }
        catch (e) {
            console.log(e.toString())
        }
    })
}
let Student = mongoose.model("Student",studentSchema)
module.exports = Student
