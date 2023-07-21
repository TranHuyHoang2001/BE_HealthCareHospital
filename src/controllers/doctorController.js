import doctorSevice from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 14;
  try {
    let response = await doctorSevice.getTopDoctorHome(+limit); //convert kiểu string sang số nguyên
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorSevice.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let postInforDoctor = async (req, res) => {
  try {
    let response = await doctorSevice.saveDetailInforDoctor(req.body);
    //req.body là dữ liệu gửi lên từ client
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let getDetailDoctorById = async (req, res) => {
  try {
    let doctorId = req.query.id;
    let infor = await doctorSevice.getDetailDoctorById(doctorId);
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let getSpecialtyById = async (req, res) => {
  try {
    let specialtyId = req.query.id;
    let infor = await doctorSevice.getSpecialtyById(specialtyId);
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let bulkCreateSchedule = async (req, res) => {
  try {
    let infor = await doctorSevice.bulkCreateSchedule(req.body);
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let getScheduleByDate = async (req, res) => {
  try {
    let infor = await doctorSevice.getScheduleByDate(
      req.query.doctorId,
      req.query.date
    );
    // req.query khi muốn lấy tham số trên đường link URL, method get
    // req.body , method post
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let getExtraInforDoctorById = async (req, res) => {
  try {
    let infor = await doctorSevice.getExtraInforDoctorById(req.query.doctorId);
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let getProfileDoctorById = async (req, res) => {
  try {
    let infor = await doctorSevice.getProfileDoctorById(req.query.doctorId);
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let getListPatientForDoctor = async (req, res) => {
   try {
     let infor = await doctorSevice.getListPatientForDoctor(req.query.doctorId, req.query.date);
     return res.status(200).json(infor);
   } catch (error) {
     console.log(error);
     return res.status(200).json({
       errCode: -1,
       message: "Error from server...",
     });
   }
}

let sendRemedy = async (req, res) => {
  try {
    let infor = await doctorSevice.sendRemedy(req.body);
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
}


module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  postInforDoctor: postInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  getSpecialtyById: getSpecialtyById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy: sendRemedy,
};
