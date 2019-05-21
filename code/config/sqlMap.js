var sqlMap = {
    //login
    checklogin_stu: 'select name, passwd from Student where Student.studentId = ?',
    checklogin_adm: 'select name, passwd from  Admin where Admin.adminId = ?',
    checklogin_rep: 'select name, passwd from Repairman where Repairman.repairmanId = ?',

    //admin
    //checkadmin_stu_mes: 'select * from Student S where S.college = ? and S.grade = ? and S.sex = ?',
    checkadmin_stu_mes: "select distinct * from Student S where",
    checkadmin_stu_mes0: "select distinct * from Student S, Accommodation A where",
    checkadmin_stuId_night: "select studentId from NightAccommodation N where",
    checkadmin_stu_night: "select * from NightAccommodation N where",
    checkadmin_acco: "select studentId from Accommodation A",
    checkadmin_acco_mes: "select * from Accommodation A",
    //modify
    modifyadmin_stu: 'update Accommodation set buildingId = ?, roomId = ? where studentId = ?',
    //checkadmin_reg
    checkadmin_reg_max: "select MAX(recordId) as max from VisitRecord",
    insertadmin_reg: 'insert into VisitRecord(recordId, visitorName, enterTime, buildingId) values (?, ?, ?, ?)',
    checkadmin_reg: "select * from VisitRecord V where ",
    updateadmin_reg: "update VisitRecord set leaveTime = ? where recordId = ?",
    //Echarts
    checkadmin_stu_grade: "select count(*) as sum from Student S where S.grade = ?",
    checkadmin_stu_college: "select count(*) as sum from Student S where S.college = ?",
    checkadmin_stu_sex: "select count(*) as sum from Student S where S.sex = ?",

    //student
    checkstu_info:'select studentId,name,sex,age,grade,college,major,phoneNumber,buildingId,roomId from Student where Student.studentId = ?',

    checkis_leave:'select * from LeavingTimeTable where studentId = ?',
    checkstu_leave:'insert into LeavingTimeTable(leavingDate,studentId,studentName,buildingId,roomId,baggageType,baggageQuantity) values(?,?,?,?,?,?,?)',
    updatestu_leave:'update LeavingTimeTable set leavingDate = ? ,baggageType = ? , baggageQuantity = ? where studentId = ?',
    deletestu_leave:'delete from LeavingTimeTable where studentId = ?',

    checkis_return:'select * from ReturningTimeTable where studentId = ?',
    checkstu_return:'insert into ReturningTimeTable(returningDate,studentId,studentName,buildingId,roomId,baggageType,baggageQuantity) values(?,?,?,?,?,?,?)',
    updatestu_return:'update  ReturningTimeTable set returningDate = ? , baggageType = ? , baggageQuantity = ? where studentId = ?',
    deletestu_return:'delete from ReturningTimeTable where studentId = ?',

    checkis_stay:'select * from ApplicationForDormitory where studentId = ?',
    checkstu_stay:'insert into ApplicationForDormitory(studentId,beginTime,endTime,reason) values(?,?,?,?)',
    updatestu_stay:'update ApplicationForDormitory set beginTime = ? , endTime = ? , reason = ? where studentId = ?',
    deletestu_stay:'delete  from ApplicationForDormitory  where studentId = ?',

    checkis_night:'select * from NightAccommodation where studentId = ?',
    checkstu_night:'insert into NightAccommodation(studentId,accomDate,YN) values(?,?,?)',
    updatestu_night:'update NightAccommodation set YN = ? where studentId = ?',
    deletestu_night:'delete from NightAccommodation where studentId = ?',
    assgin_dormitory:'insert into Accommodation (Accommodation.studentId, Accommodation.buildingId, Accommodation.roomId) values(?,1,102)',
    find_dormitory:'select min(roomId) as assign_room from Dormitory where buildingId = ? and remainingBeds = ?',
    assign_dormitory:'insert into Accommodation (Accommodation.studentId, Accommodation.buildingId, Accommodation.roomId) values(?,?,?)',
    delete_assign:'delete from Accommodation where studentId = ?',
    assign_info:'select buildingId,roomId from Accommodation where studentId = ?',
};

module.exports = sqlMap;