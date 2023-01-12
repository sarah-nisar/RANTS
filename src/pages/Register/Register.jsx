import React, { useCallback, useEffect, useState } from "react";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";
import { authenticator } from "otplib";
import Modal from "react-modal";
import axios from "../../helpers/axios";

const Register = () => {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(
    "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"
  );

  const secret = authenticator.generateSecret();
  const token = authenticator.generate(secret);

  const navigate = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [otp, setOtp] = useState("");

  const [pubAddr, setPubAddr] = useState("");
  const [sid, setSid] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");

  const { registerStudent, getStudent } = useCVPContext();
  const { checkIfWalletConnected, currentAccount } = useAuth();

  function closeModal() {
    setModalIsOpen(false);
  }
  const openModal = async (e) => {
    e.preventDefault();
    if (
      pubAddr === "" ||
      sid === "" ||
      email === "" ||
      name === "" ||
      mobileNo === ""
    ) {
      alert("Enter all details first");
      return;
    } else {
      setModalIsOpen(true);
      console.log("hjdab");
      await axios
        .post("/register", { email })
        .then((res) => {
          console.log("res", res);
        })
        .catch((err) => {
          console.log("Errrr", err);
        });
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  const fetchStudent = useCallback(async () => {
    try {
      const student = await getStudent();
      if (student) {
        navigate("/dashboard");
      }
    } catch (err) {
      // console.log(err);
    }
  });

  useEffect(() => {
    fetchStudent();
  }, [currentAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post("/register/otp", { otp })
        .then((res) => {
          console.log("res", res);
        })
      try {
        await registerStudent(name, email, pubAddr, mobileNo, sid);

        navigate("/dashboard");
      } catch (err) {
        console.log(err);
        return;
      }
    } catch (err) {
      console.log("OTP error on frontend", err);
    }
  };

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Enter OTP"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <button className={`${styles.closeButton}`} onClick={closeModal}>
          close
        </button>
        <h2
          className={styles.heading}
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          Enter OTP
        </h2>

        <form>
          <div className={styles.inputGroup}>
            <input
              className={`${styles.input}`}
              style={{
                resize: "none",
              }}
              type="text"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
            />
          </div>

          <button className={`${styles.submitButton}`} onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </Modal>
      <div className={styles.registerPageContainer}>
        <form className={`${styles.formBox}`}>
          <h2 className={`${styles.heading}`}>Register</h2>

          <div className={`${styles.inputContainer}`}>
            <label className={`${styles.inputLabel}`}>Public Address</label>
            <input
              className={`${styles.input}`}
              type="text"
              placeholder="Enter public address"
              onChange={(e) => setPubAddr(e.target.value)}
              value={pubAddr}
            />
          </div>
          <div className={`${styles.inputContainer}`}>
            <label className={`${styles.inputLabel}`}>Name</label>
            <input
              className={`${styles.input}`}
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div className={`${styles.inputContainer}`}>
            <label className={`${styles.inputLabel}`}>Student ID</label>
            <input
              className={`${styles.input}`}
              type="text"
              placeholder="Enter your VJTI Registration ID"
              onChange={(e) => setSid(e.target.value)}
              value={sid}
            />
          </div>

          <div className={`${styles.inputContainer}`}>
            <label className={`${styles.inputLabel}`}>Mobile No</label>
            <input
              className={`${styles.input}`}
              type="text"
              placeholder="Enter your mobile number"
              onChange={(e) => setMobileNo(e.target.value)}
              value={mobileNo}
            />
          </div>

          <div className={`${styles.inputContainer}`}>
            <label className={`${styles.inputLabel}`}>VJTI Email ID</label>
            <input
              className={`${styles.input}`}
              type="text"
              placeholder="Enter your VJTI Email ID"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <a className={`${styles.registerBtn}`} onClick={openModal}>
            <span className="ml-4">Register</span>
          </a>
        </form>
      </div>
    </>
  );
};

export default Register;
