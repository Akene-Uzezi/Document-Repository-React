const multer = require("multer");
const uuid = require("uuid").v4;
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

const configuredMulterMiddleware = upload.single("file");

module.exports = configuredMulterMiddleware;
