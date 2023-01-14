// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const initializeApp = require("firebase/app").initializeApp;
const getFirestore = require("firebase/firestore").getFirestore;
const collection = require("firebase/firestore").collection;
const addDoc = require("firebase/firestore").addDoc;
const doc = require("firebase/firestore").doc;
const setDoc = require("firebase/firestore").setDoc;
const getDoc = require("firebase/firestore").getDoc;

const { authenticator } = require("otplib");
var cloudinary = require("cloudinary").v2;
const upload = require("multer")();
const streamifier = require("streamifier");

const sgMail = require("@sendgrid/mail");

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrq2EpT_hNieQbs1GIgSkGXqGF-Fa7UQI",
  authDomain: "centenary-1ac4e.firebaseapp.com",
  databaseURL: "https://centenary-1ac4e-default-rtdb.firebaseio.com",
  projectId: "centenary-1ac4e",
  storageBucket: "centenary-1ac4e.appspot.com",
  messagingSenderId: "647205891121",
  appId: "1:647205891121:web:c19e6ed4340db83af5f910",
  measurementId: "G-ZNZ83R972Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

var getStorage = require("firebase/storage").getStorage;
var ref = require("firebase/storage").ref;
var uploadBytesResumable = require("firebase/storage").uploadBytesResumable;
var getDownloadUrl = require("firebase/storage").getDownloadURL;

const storage = getStorage(app);
const db = getFirestore(app);

// const storage = firebase.storage(app)
// const analytics = getAnalytics(firebase);

cloudinary.config({
  cloud_name: "dwquo7ex8",
  api_key: "536437728985795",
  api_secret: "3XAmeZQ_bBFDvpt0Icq9Nk0QTlA",
});

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

exports.commentController = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  } else {
    const { comment, _reqId, _email } = req.body;
    console.log("here", comment, _reqId, _email);
    const emailData = {
      from: "appatil_b19@ce.vjti.ac.in",
      to: _email,
      subject: "Document not issued",
      html: `<h4>Sorry, we are unable to issue your document with request ID: ${_reqId}.
      The following comment is stated by the issuer: ${comment}</h4>`,
    };
    sgMail
      .send(emailData)
      .then((sent) => {
        return res.status(200).json({
          message: `Email has been sent to ${_email}`,
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

exports.documentUploadController = async (req, res) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      console.log(file.buffer);
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    console.log("$$$$$$$$$$$$$$$$$$$$$$");
    console.log(result);
  }

  upload(req);
  console.log("Done");
  return res.status(200).json({
    message: "Done!",
  });
};

exports.uploadToFirestoreController = async (req, res) => {
  console.log(req.files);
  console.log(req.body.docId);
  console.log(req.formData);
  if (!req.files) {
    res.status(400).send("Error: No files found");
  }
  const formData = req.files[0];
  const storageRef = ref(storage, `files/${formData.originalname}`);
  const uploadTask = uploadBytesResumable(storageRef, formData.buffer);
  // console.log("req", storageRef);

  try {
    const downloadUrl = await getDownloadUrl(uploadTask.snapshot.ref);
    console.log("-------------------------");
    console.log(downloadUrl);
    const docRef = doc(db, "Docs", req.body.docId);
    console.log(docRef);
    setDoc(docRef, { Url: downloadUrl });

    console.log("Document written with ID: ", docRef.id);

    return res.status(200).json({
      message: "Reference document uploaded successfully",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: "Reference document could not be uploaded\n" + err,
    });
  }
};

exports.getDocumentController = async (req, res) => {
  // const downloadUrl = await getDownloadUrl(uploadTask.snapshot.ref);
  //   console.log("-------------------------");
  //   console.log(downloadUrl);
  console.log("req.body.docId", req.body.docId);
  const docRef = doc(db, "Docs", req.body.docId);
  // console.log(docRef);
  const docSnap = await getDoc(docRef);
  console.log("docSnap", docSnap.exists());
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return res.status(200).json({ data: docSnap.data() });
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return res.status(400).json({
      success: false,
      error: "No such document!",
    });
  }
};
