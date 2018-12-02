const express = require("express");
const router = express.Router();
const multer = require("muler");
const path = require("path");

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
router.post("/img", upload.single("img")), // img는 html의 type=file가 있는 input태그의 id
  (req, res) => {
    console.log(req.file); // multer로 업로드 한 건 req.file에 저장됨
    res.json({ url: `/img/${req.file.filename}` });
  };
router.post("/");
module.exports = router;
