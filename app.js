const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const cors = require("cors");

const indexRouter = require("./routes/index.js");
const usersRouter = require("./routes/users.js");
const assessmentRouter = require("./routes/assessment.js");
const { db_connection } = require("./configs/connect_db.js");

const app = express();
db_connection()
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const whitelist = process.env.WHITELIST;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name, user-access-token, authorization");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  } else if (whitelist.indexOf(req.header("Origin")) !== -1 || whitelist.indexOf(req.header("Referer")) !== -1) {
    next();
  } else {
    return res.status(400).json("App UnAuthorized");
  }
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/assessment", assessmentRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

module.exports = app;
