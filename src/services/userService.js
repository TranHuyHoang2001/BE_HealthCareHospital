import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt); // chờ dùng thư viện băm mật khẩu
      // Store hash in your password DB.
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        //user already exist
        let user = await db.User.findOne({
          attributes: [
            "id",
            "email",
            "roleId",
            "password",
            "firstName",
            "lastName",
          ],
          where: { email: email }, // email phải là email truyền vào
          // attributes: {
          //   include: ["email", "roleId"],
          // các trường muốn lấy ra
          //exclude: ["password"],
          // các trường không muốn lấy ra
          // },
          raw: true, // tra ve 1 object json
        });
        if (user) {
          //compare password
          let check = await bcrypt.compareSync(password, user.password);
          // so sánh password truyền vào và password trong db (user.password)
          // password là plain text, user.password là hash password (encrypt : mã hoá) , 2 cái khác nhau nên phải dùng bcrypt.compareSync để so sánh
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "OK";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's not found.`;
        }
      } else {
        //return error
        userData.errCode = 1;
        userData.errMessage = `Your's email is not exist.`;
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

// kiểm tra email có tồn tại hay không
let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"], // không lấy password
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"], // không lấy password
          },
        });
      }
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

let createNewUser = (data) => {
  // data từ client truyền vào
  return new Promise(async (resolve, reject) => {
    try {
      // check email đã tồn tại hay chưa
      let check = await checkUserEmail(data.email);
      if (check === true) {
        return resolve({
          errCode: 1,
          message: "Email is already exist",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password); // chờ dùng thư viện băm mật khẩu
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phonenumber: data.phonenumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.avatar,
        });
        resolve({
          errCode: 0,
          message: "OK",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (user) {
        await db.User.destroy({
          where: { id: userId },
        });
        resolve({
          errCode: 0,
          message: "User is deleted",
        });
      } else {
        resolve({
          errCode: 1,
          message: "User is not exist",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.roleId || !data.positionId || !data.gender) {
        // off dieu kien roleId, positionId, gender moi chạy được CRUD user (system/user-manage)
        resolve({
          errCode: 2,
          message: "Missing required parameter",
        });
      }
      let user = await db.User.findOne({
        where: {
          id: data.id, // tìm 1 user có id = data.id (id truyền vào )
        },
        raw: false,
      });
      if (user) {
        // cập nhật thông tin theo biến data truyền vào
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.roleId = data.roleId;
        user.positionId = data.positionId;
        user.gender = data.gender;
        user.phonenumber = data.phonenumber;
        user.image = data.avatar;
        // tương tự cập nhật password thì hashpassword giống hàm createNewUser và gán cho user.password
        await user.save();
        // lỗi: user.save() not a function do file config.json set raw: true

        // await db.User.save({
        //     firstName: data.firstName,
        //     lastName: data.lastName,
        //     address: data.address,
        // })
        resolve({
          errCode: 0,
          message: "User is updated",
        });
      } else {
        resolve({
          errCode: 1,
          message: "User is not found!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          message: "Missing required parameter",
        });
      } else {
        let res = {};
        let allCode = await db.Allcode.findAll({
          where: { type: typeInput },
        }); // tham chiếu đến bảng Allcode trong db (sequelize) , models allcode.js
        res.errCode = 0; // append key errCode và data vào res (object)
        res.data = allCode;
        resolve(res);
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService,
};
