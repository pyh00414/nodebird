exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).sned("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // isAuthenticated()는 passport가 추가해줌. logi여부를 확인할 수 있다.
    next();
  } else {
    res.redirect("/");
  }
};
