const express = require("express");
const { registerController, otpController, commentController } = require("../controllers/register.controller");
const router = express.Router();

router.post("/", registerController);
router.post("/otp", otpController);
router.post("/comment", commentController);

module.exports = router;
