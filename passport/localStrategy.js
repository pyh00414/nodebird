const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = passport => {
  passport.use(
    new localStrategy(
      {
        usernameField: "email", // req.body.email
        passwordField: "password" // req.body.password  , express.urlencoded가 처리한 값을 받음
      },
      async (email, password, done) => {
        // done(에러,성공,포맷) : 에러 나면 첫번쨰 인자로 에러를 넘어주면 됨.
        // done(서버에서)
        // done(null, 사용자정보)
        // done(null, false, 실패정보)
        try {
          const exUser = await User.find({ where: { email } });

          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);

            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
