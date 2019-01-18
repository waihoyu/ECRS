
## 选修课报名系统（ECRS）

   ### 技术选型：
    服务器破还要高并发，nodejs很适合，并且选修课系统都是io没有计算，nodejs更适合了。
   ### 需求分析：
    1、在选课之前，为了防止学生给别人乱报名，所以需要给学生生成不同的初始密码，并印刷密码条由班主任亲自放到学生个人。
    
    解决方法：在项目中提供导入excel表，让系统自动识别学生，生成初始密码，导出excel表，方便教务处老师打印。
    
    2、每个学生限选两门课程，并且系统需要验证课程不在同一天，课程有年级限制，必须符合年纪规定的才能报名。
    
    解决方法：北航的选修课是周二、周三、周五开设，每天只有一门课，都是下午最后一节课之后。一个学生如果周二报名了一节课，此时将不能继续报名周二的课程。每个学生总数是两门课程，不能多选。
    
   ### 用例图：
