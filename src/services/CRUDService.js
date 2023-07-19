import bcrypt from "bcryptjs";
import db from "../models/index.js";

const salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password); // chờ dùng thư viện băm mật khẩu
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });

      resolve("ok create a new user succeed");
    } catch (e) {
      reject(e);
    }
  });
};
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
let getAllUser = () => {
  // có 1 promise chờ khi nào nó resolve thì mới chạy tiếp
  return new Promise(async (resolve, reject) => {
    try {
      // User là modelName của user.js trong models
      let users = await db.User.findAll({
        raw: true,
      }); // tìm tất cả các user trong bảng User
      resolve(users); // trả về kết quả tương đương với return
    } catch (e) {
      reject(e);
    }
  });
};
let getUserInfoById = (userId) => {
  // 1 hàm cần kết nối tới db và để tránh bất đồng bộ thì dùng promise
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        // findOne là kết nối đến dữ liệu là 1 hành động bất đồng bộ tốn thời gian nên dùng async await
        // await là chờ đợi hành động bất đồng bộ  (lấy dữ liệu) xong mới chạy tiếp
        where: {
          id: userId,
        },
        raw: true,
      });
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {
          id: data.id, // tìm 1 user có id = data.id (id truyền vào )
        },
      });
      if (user) {
        // cập nhật thông tin theo biến data truyền vào
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;

        await user.save(); // lưu lại
        let allUsers = await db.User.findAll(); // lấy tất cả các user
        resolve(allUsers); // trả về kết quả (thoát khỏi promise)
      } else {
        resolve();
      }
    } catch (error) {
      console.log(error);
    }
  });
};
let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        // lấy giá trị của userId gán cho id
      });
      // nếu ko tìm thấy id vẫn trả về delete success vì hàm deleteUserId vẫn được gọi và return vào resolve nhưng nó ko chạy đến user destroy
      if (user) {
        await user.destroy();
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
  deleteUserById: deleteUserById,
};
