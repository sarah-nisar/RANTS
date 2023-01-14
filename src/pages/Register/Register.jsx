import React, { useCallback, useEffect, useState } from "react";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { authenticator } from "otplib";
import Modal from "react-modal";
import axios from "../../helpers/axios";
import CloseIcon from "@mui/icons-material/Close";
import MoonLoader from "react-spinners/MoonLoader";
import { ToastContainer, toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [otp, setOtp] = useState("");

  const [pubAddr, setPubAddr] = useState("");
  const [sid, setSid] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      toast.error("Enter all details first");
      return;
    } else {
      if (email.slice(-10) === "vjti.ac.in") {
        setModalIsOpen(true);
        console.log("hjdab");
        await axios
          .post("/register", { email })
          .then((res) => {
            console.log("res", res);
            toast.success(res.data.message);
          })
          .catch((err) => {
            console.log("Errrr", err);
            toast.error(err);
          });
      } else {
        toast.error("Please enter vjti email address");
        return;
      }
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
      toast.error(err);
      console.log(err);
    }
  });

  useEffect(() => {
    fetchStudent();
    setPubAddr(currentAccount);
  }, [currentAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      await axios.post("/register/otp", { otp }).then((res) => {
        toast.warn("Please wait sometime")
        console.log("res", res);
      });
      try {
        await registerStudent(name, email, pubAddr, mobileNo, sid);
        toast.success("Registration successful")
        navigate("/dashboard");
      } catch (err) {
        console.log(err);
        toast.error(err);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      setIsLoading(false);
      toast.error("OTP error on frontend");
      console.log("OTP error on frontend", err);
    }
  };

  return (
    <>
      <ToastContainer />
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
        <div className={styles.modalContainer}>
          <button className={styles.closeButton} onClick={closeModal}>
            <CloseIcon />
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
              {isLoading ? (
                <MoonLoader className={styles.loader} color="white" size={20} />
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
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

          <button onClick={openModal} className={styles.registerBtn}>
            Register
            <ArrowForwardIcon className={styles.arrowForwardIcon} />
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
