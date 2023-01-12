const express = require("express");
const { registerController, otpController } = require("../controllers/register.controller");
const router = express.Router();

router.post("/", registerController);
router.post("/otp", otpController);

module.exports = router;
