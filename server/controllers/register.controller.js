const { authenticator } = require("otplib");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  //   "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"
  "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"
);

// Validators
const { validationResult } = require("express-validator");
const secret = "authenticator.generateSecret()";
let token;
// const isValid2 = authenticator.check(token, secret);
// console.log("isValidABOVE", isValid2);

exports.registerController = (req, res) => {
  //   console.log("yahoo");
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  } else {
    // Alternative:
    // Note: .generateSecret() is only available for authenticator and not totp/hotp
    // console.log("secret", secret);
    // console.log("token", token);
    token = authenticator.generate(secret);

    const temp = token;
    const emailData = {
      from: "appatil_b19@ce.vjti.ac.in",
      to: email,
      subject: "OTP for Email Verification",
      html: `<h1>OTP to verify your email address is ${temp}</h1>`,
    };
    sgMail
      .send(emailData)
      .then((sent) => {
        return res.status(200).json({
          message: `Email has been sent to ${email}`,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          success: false,
          error: "Could not send email\n" + err,
        });
      });
  }
};

exports.otpController = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  } else {
    const { otp } = req.body;
    // console.log("otp", otp);
    try {
      const isValid = true ? otp === token : false;
      console.log("isValid", isValid);
      if (isValid) {
        return res.status(200).json({
          message: "OTP Valid",
        });
      } else {
        return res.status(400).json({
          message: "OTP InValid",
        });
      }
      // or
      // const isValid = authenticator.verify({ token, secret });
    } catch (err) {
      // Possible errors
      // - options validation
      // - "Invalid input - it is not base32 encoded string" (if thiry-two is used)
      return res.status(400).json({
        success: false,
        error: "Some error\n" + err,
      });
    }
  }
};

exports.commentController = (req, res) =>{
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  } else {
    const { comment, reqId } = req.body;
    const emailData = {
      from: "appatil_b19@ce.vjti.ac.in",
      to: email,
      subject: "Document not issued",
      html: `<h1>Sorry, we are unable to issue your document with request ID: ${reqId}.
      The following comment is stated by the issuer: ${comment}</h1>`,
    };
    sgMail
      .send(emailData)
      .then((sent) => {
        return res.status(200).json({
          message: `Email has been sent to ${email}`,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          success: false,
          error: "Could not send email\n" + err,
        });
      });
  }
}
