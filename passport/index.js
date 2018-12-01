const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const { User } = require("../models");

module.exports = passport => {
  passport.serializeUser((user, done) => {
    // auth의 req.login이 실행되면이 serializeUser이 실행.(user.done은) req.login으로 부터 넘어온 값
    done(null, user.id); // {id:'whwlsvy12', pw:'dusgh4314',.....]}을 사용하는데, 사용자가 많으면 너무 무거워짐 -> 고유값 id만 넣자.
  });

  // 메모리에 한번만 저장
  passport.deserializeUser((id, done) => {
    // 매 요청마다 실행. app의 app.use(passport.session())에 의해 호출됨

    User.find({ where: { id } })
      .then(user => done(null, user)) // user.id를 DB조회해서 req.user에 넣음. 모든 요청에 실행되기 때문에 DB조회를 캐싱해줘야 한다.
      .catch(err => done(err));
  });

  local(passport);
  kakao(passport);
};
