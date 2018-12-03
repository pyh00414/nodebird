const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.find({ where: { email } });
    if (exUser) {
      req.flash("joinError", "이미 가입된 이메일입니다.");
      return res.redirect("/join");
    } else {
      const hash = await bcrypt.hash(password, 12); // 12 : 높은수록 암호복잡,속도저하
      await User.create({
        email,
        nick,
        password: hash
      });
      return res.redirect("/");
    }
  } catch (err) {
    console.err(err);
    next(err);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  // router.get(미들웨어1,미들웨어2,미들웨어3) -> 미들웨어1,2,3 순으로 진행. 지금은 isNotLogedIn부터 진행
  passport.authenticate("local", (authError, user, info) => {
    // ********** localStrategy의 done(a,b,c)에서 각각 autoError=a, b=user, c=info가 된다.
    if (authError) {
      console.error(authError);
      next(authError);
    }
    if (!user) {
      req.flash("loginError", info.message);
      return res.redirect("/");
    }

    return req.login(user, loginError => {
      // 로그인 후에는 req.user에서 사용자 정보를 받아온다.
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout(); // logout()은 passport에서 추가해주는 부분
  req.session.destroy(); // req.user을 지움
  res.redirect("/");
});

// (1)
router.get("/kakao", passport.authenticate("kakao")); // kakaoStrategy가 실행됨 -> 카카오서버가 대신 로그인 인증

// (3)
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/"
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
