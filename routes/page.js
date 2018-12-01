const express = require("express");
const { isLogedIn, isNotLogedIn } = require("./middlewares");

const router = express.Router();

router.get("/profile", isLogedIn, (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird", user: null });
});

router.get("/join", isNotLogedIn, (req, res) => {
  res.render("join", {
    title: "회원가입 - NodeBird",
    user: req.user,
    joinError: req.flash("joinError")
  });
});

router.get("/", (req, res, next) => {
  res.render("main", {
    title: "NodeBird",
    twits: [],
    user: req.user,
    loginError: req.flash("loginError")
  });
});

module.exports = router;
