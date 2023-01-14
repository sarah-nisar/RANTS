const express = require("express");
const upload = require("multer")();

const {
  registerController,
  otpController,
  documentUploadController,
  getDocumentController,
  uploadToFirestoreController,
  commentController,
} = require("../controllers/register.controller");
const router = express.Router();

router.post("/", registerController);
router.post("/otp", otpController);
router.post("/comment", commentController);

router.post(
  "/documentUpload",
  upload.single("pdffile"),
  documentUploadController
);
router.post("/getDocument", getDocumentController);
router.post("/toFirestore", upload.any(), uploadToFirestoreController);
module.exports = router;
