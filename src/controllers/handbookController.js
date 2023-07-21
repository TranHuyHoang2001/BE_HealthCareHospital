import HandbookService from "../services/handbookService";

let createHandbook = async (req, res) => {
  try {
    let infor = await HandbookService.createHandbook(req.body);
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let getAllHandbook = async (req, res) => {
   try {
     let infor = await HandbookService.getAllHandbook();
     return res.status(200).json(infor);
   } catch (error) {
     console.log(error);
     return res.status(200).json({
       errCode: -1,
       message: "Error from server...",
     });
   }
};
let getDetailHandbookById = async (req, res) => {
    try {
      let infor = await HandbookService.getDetailHandbookById(req.query.id);
      return res.status(200).json(infor);
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        errCode: -1,
        message: "Error from server...",
      });
    }
};

module.exports = {
  createHandbook: createHandbook,
  getAllHandbook: getAllHandbook,
  getDetailHandbookById: getDetailHandbookById,
};
