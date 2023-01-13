const express = require("express");
const upload = require('multer')();

const { registerController, otpController, documentUploadController, getDocumentController, uploadToFirestoreController } = require("../controllers/register.controller");
const router = express.Router();

router.post("/", registerController);
router.post("/otp", otpController);
router.post("/documentUpload", upload.single("pdffile"),documentUploadController);
router.get("/getDocument", getDocumentController);
router.post("/toFirestore", upload.any(), uploadToFirestoreController);
module.exports = router;
