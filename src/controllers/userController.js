import userService from "../services/userService";
let handleLogin = async (req, res) => {
  // lấy thông tin người dùng truyền lên
  // gửi kèm tham số email và password
  // check email exist
  // compare password
  // return userInfor
  // access_token: JWT validate người dùng
  // mỗi 1 api gửi lên kèm theo token
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      // error code: 0 -> login thành công
      message: "Missing input parameter",
    });
  }

  let userData = await userService.handleUserLogin(email, password);
  console.log(userData);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {}, // nếu userData trả ra có object user thì trả về user, nếu không có thì trả về {}
  });

  // let user = await UserModel.findByEmail(email);
  // if (!user) {
  // 1 api sẽ trả về 1 status code và 1 json
  //     return res.status(200).json({
  //     errCode: -1,
  //     message: "User does not exist",
  //     });
  // }
  // let checkPassword = await user.comparePassword(password);
  // if (!checkPassword) {
  //     return res.status(200).json({
  //     errCode: -2,
  //     message: "Wrong password",
  //     });
  // }
  // return res.status(200).json({
  //     errCode: 0,
  //     message: "Login success",
  //     user: user,
  // });
};

let handleGetAllUsers = async (req, res) => {
  let id = req.query.id; // ALL: Lấy tất cả người dùng , id: Lấy 1 người dùng
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameter",
      users: [],
    });
  }
  let users = await userService.getAllUsers(id);
  return res.status(200).json({
    errCode: 0,
    message: "Success",
    users: users, // có thể viết tắt cả key và value là users vì giống nhau
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
  let data = req.body; // lay du lieu tu form , lấy tất cả input đặt name vd req.body.name ra dữ liệu name đó
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
  if(!req.body.id){
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameter",
    });
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
};

let getAllCode = async (req, res) => {
  try {
    setTimeout(async () => {
      let data = await userService.getAllCodeService(req.query.type);
      return res.status(200).json(data);
    }, 3000);
  } catch (e) {
    console.log("Get all code error: ",e);
      return res.status(200).json({
        errCode: -1,
        message: "Error from server",
      });
  }
}
module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  getAllCode: getAllCode
};
// 1 api sẽ trả về 1 status code và 1 object dạng json
