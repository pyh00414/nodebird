const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { Post, Hashtag, User } = require("../models");
const { isLoggedIn } = require("./middlewares");

const upload = multer({
  storage: multer.diskStorage({
    // 어디에 저장할지
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(
        null,
        path.basename(file.originalname, ext) + new Date().valueOf + ext
      );
    }
  }),
  limit: { fileSize: 5 * 1024 * 1024 } // 파일사이즈(바이트단위)
});
router.post(
  "/img",
  isLoggedIn,
  upload.single("img"), // img는 html의 type=file가 있는 input태그의 id
  (req, res) => {
    console.log(req.file); // multer로 업로드 한 건 req.file에 저장됨
    res.json({ url: `/img/${req.file.filename}` });
  }
);

const upload2 = multer();

router.post("/", isLoggedIn, upload2.none(), async (req, res, next) => {
  // 게시글 업로드
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      userId: req.user.id
    });
    const hashtags = req.body.content.match(/#[^\s]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          Hashtag.findOrCreate({
            // findOrCreate : db에 있으면 찾고 없으면 생성
            where: { title: tag.slice(1).toLowerCase() }
          });
        })
      );

      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/hashtag", async (req, res, next) => {
  const query = req.query.hashtag;

  if (!query) {
    return res.redirect("/");
  }
  try {
    const hashtag = await Hashtag.find({ where: { title: query } });
    console.log(hashtag);
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }
    return res.render("main", {
      title: `${query} | NodeBird`,
      user: req.user,
      twits: posts
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
