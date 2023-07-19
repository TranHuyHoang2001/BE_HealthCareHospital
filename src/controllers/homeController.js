import db from "../models/index.js";
import CRUDService from "../services/CRUDService.js";
let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll(); // tìm tất cả các user trong bảng User

    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

// file ejs tự tìm đến thư mục views
let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};
// object: {
//     key: '';
//     value: ''
// }
let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};
let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  //console.log(message);
  return res.send(
    `<a href="/get-crud" type="button">Create user done, Back to display</a>`
  );
};
let displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  return res.render("displayCRUD.ejs", {
    dataTable: data,
  });
};
let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDService.getUserInfoById(userId); // chờ service trả về dữ liệu
    // check user data not found
    return res.render("editCRUD.ejs", {
      user: userData,
      // giá trị của biến userData sẽ được gán cho biến user
    });
  } else {
    return res.send("User is not found");
  }
};
let putCRUD = async (req, res) => {
  let data = req.body; // lay du lieu tu form , lấy tất cả input đặt name vd req.body.name ra dữ liệu name đó
  let allUsers = await CRUDService.updateUserData(data);
  return res.render("displayCRUD.ejs", {
    dataTable: allUsers,
    // giá trị của biến userData sẽ được gán cho biến user
  });
};
let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    let allUsers = await CRUDService.deleteUserById(id);
    // return res.render("displayCRUD.ejs", {
    //   dataTable: allUsers,
    // });
    return res.send(
      `<a href="/get-crud" type="button">Delete user done, Back to display</a>`
    );
  } else {
    return res.send("User is not found");
  }
};
// dùng ngoài file này phải export
module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
