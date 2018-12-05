const express = require("express");
const cookieParse = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

require("dotenv").config();
const { sequelize } = require("./models");
const passportConfig = require("./passport");

const app = express();

const indexRouter = require("./routes/page");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

sequelize.sync();
passportConfig(passport);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PRT || 8001);

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public"))); //main.css로 가져올 수 있음 (프론트에서 접근 경로)
app.use("/img", express.static(path.join(__dirname, "uploads"))); // img/asd.png  -> 실제로 asd.png는 uploads폴더 안에 있음 (프론트에서 접근 경로)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParse(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
);
app.use(flash());
app.use(passport.initialize()); // passport 설정을 초기화
app.use(passport.session()); // passport localStrategy로 로그인할 때 사용자 정보를 세션에 저장, express session보다 아래 있어야함. **** passport의 deserializeUser를 실행 *********

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);

app.use((req, res, next) => {
  const err = new Error("not found");
  res.status(404);
  next(err);
});

app.use((err, req, res) => {
  res.locals.message = res.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log("server running on 8001 port");
});
