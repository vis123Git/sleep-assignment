const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
const swaggerDocs = require("./swagger");
const indexRouter = require("./routes/index.js");
const usersRouter = require("./routes/users.js");
const { db_connection } = require("./configs/connect_db.js");

const app = express();
swaggerDocs(app);

db_connection();
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const whitelist = process.env.WHITELIST
  ? process.env.WHITELIST.split(",").map((item) => item.trim().replace(/\/$/, ""))
  : [];
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-File-Name, user-access-token, authorization");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");

  const origin = req.header("Origin") ? req.header("Origin").replace(/\/$/, "") : null;
  const referer = req.header("Referer") ? new URL(req.header("Referer")).origin.replace(/\/$/, "") : null;

  // Bypass Origin/Referer check for local development or same-origin requests
  if (!origin && !referer && process.env.NODE_ENV === "development") {
    return next();
  }

  // Handle OPTIONS preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  // Normalize the origin/referer comparison to avoid trailing slash issues
  if ((origin && whitelist.includes(origin)) || (referer && whitelist.includes(referer))) {
    return next();
  } else {
    return res.status(400).json("App UnAuthorized");
  }
});

app.use("/", indexRouter);
app.use("/api/users", usersRouter);

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
