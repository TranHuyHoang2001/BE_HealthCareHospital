import express from "express";
import bodyParser from "body-parser";
// body-parser giúp lấy dữ liệu từ form gửi lên
// /user?id=7 server muốn lấy id thì phải dùng body-parser
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
//import cors from "cors";
require("dotenv").config();

let app = express();
//app.use(cors({ origin: true }));

// cấu hình cors trên initWebRoutes ngay sau khi khởi tạo express

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // req, res, next là 3 tham số của middleware
  // client -> call api (route) -> controller
  // middleware là 1 hàm được gọi trước khi gọi controller
  // middleware có thể làm thay đổi req, res, next
  // client -> call api (route) -> middleware -> controller

  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//config app
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
viewEngine(app);
initWebRoutes(app);
connectDB();
let port = process.env.PORT || 6969;
// Port === undefined => port = 6969 (ứng dụng sẽ không chết)
app.listen(port, () => {
  console.log("Backend is running on port: " + port);
});
