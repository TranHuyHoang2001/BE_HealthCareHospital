const db = require("../models");

let createSpecialty = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        await db.Specialty.findOrCreate({
          where: { name: data.name },
          defaults: {
            name: data.name,
            image: data.imageBase64,
            descriptionHTML: data.descriptionHTML,
            descriptionMarkdown: data.descriptionMarkdown,
          },
        });
        resolve({
          errCode: 0,
          message: "Create Specialty Success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllSpecialty = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
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
        message: "Get All Specialty Success",
        data: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailSpecialtyById = async (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          message: "Missing required id parameter",
        });
      } else {
        // query 2 lan lan 1 de lay specialty, lan 2 de lay all doctor thuoc specialty do (hoac query 1 lan dung attributes include bang doctor_infor lay theo specialtyId va can sua moi quan he cac model)
        let data = await db.Specialty.findOne({
          where: { id: inputId },
          attributes: ["descriptionHTML", "descriptionMarkdown"],
        });

        if (data) {
          let doctorSpecialty = [];
          if (location === "ALL") {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: inputId },
              attributes: ["doctorId", "provinceId"],
            });
          }else{
            //find by location
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { 
                specialtyId: inputId,
                provinceId: location
               },
              attributes: ["doctorId", "provinceId"],
            });
          }

          data.doctorSpecialty = doctorSpecialty;
        } else {
          data = {};
        }

        resolve({
          errCode: 0,
          message: "Get Specialty By Id Success",
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createSpecialty: createSpecialty,
  getAllSpecialty: getAllSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById,
};
