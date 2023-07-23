const db = require("../models");

let createClinic = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        await db.Clinic.findOrCreate({
          where: { name: data.name },
          defaults: {
            name: data.name,
            address: data.address,
            image: data.imageBase64,
            descriptionHTML: data.descriptionHTML,
            descriptionMarkdown: data.descriptionMarkdown,
          },
        });
        resolve({
          errCode: 0,
          message: "Create Clinic Success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllClinic = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();
      //convert BLOB sang binary (decode anh)
      // encode: file -> binary
      // decode: binary(db) -> string
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        message: "Get All Clinic Success",
        data: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailClinicById = async (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId ) {
        resolve({
          errCode: 1,
          message: "Missing required id parameter",
        });
      } else {
        // query 2 lan lan 1 de lay specialty, lan 2 de lay all doctor thuoc specialty do (hoac query 1 lan dung attributes include bang doctor_infor lay theo specialtyId va can sua moi quan he cac model)
        let data = await db.Clinic.findOne({
          where: { id: inputId },
          attributes: ["name", "image", "address", "descriptionHTML", "descriptionMarkdown"],
        });

        if (data) {
          let doctorClinic = [];
            doctorClinic = await db.Doctor_Infor.findAll({
              where: { clinicId: inputId },
              attributes: ["doctorId", "provinceId"],
            });
          data.image = Buffer.from(data.image, "base64").toString("binary");
          data.doctorClinic = doctorClinic;
        } else {
          data = {};
        }

        resolve({
          errCode: 0,
          message: "Get Clinic By Id Success",
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createClinic: createClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById,
};
