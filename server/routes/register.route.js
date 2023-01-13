const express = require("express");
<<<<<<< HEAD
const { registerController, otpController, commentController } = require("../controllers/register.controller");
=======
const upload = require('multer')();

const { registerController, otpController, documentUploadController, getDocumentController, uploadToFirestoreController } = require("../controllers/register.controller");
>>>>>>> c55df7aced3e3ab15781ef75adaa783a62e9f85b
const router = express.Router();

router.post("/", registerController);
router.post("/otp", otpController);
<<<<<<< HEAD
router.post("/comment", commentController);

=======
router.post("/documentUpload", upload.single("pdffile"),documentUploadController);
router.get("/getDocument", getDocumentController);
router.post("/toFirestore", upload.any(), uploadToFirestoreController);
>>>>>>> c55df7aced3e3ab15781ef75adaa783a62e9f85b
module.exports = router;
