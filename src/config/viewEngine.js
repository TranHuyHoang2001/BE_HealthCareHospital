import express from 'express';


let configViewEngine = (app) => {
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");  // set view engine to ejs giống jsp của java và blade của laravel php
    //tác dụng của view engine là để render ra html (câu lệnh logic if else for...)
    app.set("views", "./src/views"); // set view folder
}

module.exports = configViewEngine;