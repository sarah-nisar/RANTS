import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useCVPContext } from "../../Context/CVPContext";
import styles from "./Requests.module.css";
import Modal from "react-modal";
import CloseIcon from "@mui/icons-material/Close";
import MoonLoader from "react-spinners/MoonLoader";

const Requests = () => {
  const {
    getStaffMember,
    fetchAllRequestsForCollegeStaff,
    getStudentByAddress,
  } = useCVPContext();
  const { checkIfWalletConnected, currentAccount } = useAuth();

  const [user, setUser] = useState([]);
  const [comment, setComment] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [inputFileName, setInputFileName] = useState("Select file");
  const [inputFile, setInputFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reqId, setReqId] = useState("");

  function closeModal() {
    setModalIsOpen(false);
  }
  function closeModal2() {
    setModalIsOpen2(false);
  }

  function navigateToUpdate() {
    navigate(`/update/${reqId}`);
  }
  const handleSubmit = () => {};
  const openModal = async (e) => {
    e.preventDefault();
    setModalIsOpen(true);
  };
  const openModal2 = async (e) => {
    e.preventDefault();
    setModalIsOpen2(true);
  };

  const uploadFile = useRef(null);

  useEffect(() => {
    checkIfWalletConnected();
    console.log("Hello");
  }, []);

  const handleFile = (e) => {
    e.preventDefault();
    uploadFile.current.click();
  };

  const handleFileChange = (e) => {
    setInputFileName(e.target.files[0].name);
    setInputFile(e.target.files);
  };

  const fetchStudent = useCallback(async () => {
    try {
      const staffMember = await getStaffMember();
      console.log(staffMember);
      setUser(staffMember);
    } catch (err) {
      navigate("/register");
    }
  });

  const fetchPendingRequests = useCallback(async () => {
    try {
      //   console.log("Hello");
      const data = await fetchAllRequestsForCollegeStaff();
      var resData = [];

      console.log("Requests:", data);

      try {
        for (let j = 1; j < data.length; j++) {
          const studentData = await getStudentByAddress(data[j].studentAdd);
          console.log("studentData", typeof studentData);
          resData.push({
            studentAdd: data[j].studentAdd,
            docName: data[j].docName,
            department: data[j].department,
            description: data[j].description,
            reqType: data[j].reqType,
            studentId: studentData.studentId,
            emailId: studentData.emailId,
            mobileNo: studentData.mobileNo,
          });
		  setReqId(data[j].reqId)
        }
        console.log("data", resData);
      } catch (err) {
        console.log(err);
      }
      setPendingdescription(resData);
    } catch (err) {
      console.log(err);
    }
  });

  useEffect(() => {
    console.log(currentAccount);
    if (currentAccount !== "") {
      fetchStudent();
      fetchPendingRequests();
    }
  }, [currentAccount]);

  const navigate = useNavigate();

  const [pendingdescription, setPendingdescription] = useState([{}]);
  return (
    <div className={styles.detailsBox}>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Input File"
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
            Input File
          </h2>

          <form className={styles.formBox}>
            <div className={styles.inputGroup}>
              <button onClick={handleFile} className={styles.inputCombined}>
                {inputFileName}
              </button>
              <input
                onChange={handleFileChange}
                ref={uploadFile}
                accept="image/*"
                className={` ${styles.fileInput}`}
                type="file"
                placeholder={""}
              />
            </div>

            <button
              className={`${styles.modalIssueBtn}`}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <MoonLoader className={styles.loader} color="white" size={20} />
              ) : (
                "Issue"
              )}
            </button>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpen2}
        onRequestClose={closeModal2}
        contentLabel="Comment"
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
          <button className={styles.closeButton} onClick={closeModal2}>
            <CloseIcon />
          </button>
          <h2
            className={styles.heading}
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            Enter your comments
          </h2>

          <form className={styles.formBox}>
            <div className={styles.inputGroup}>
              <input
                className={`${styles.input}`}
                style={{
                  resize: "none",
                }}
                type="text"
                placeholder="Enter comment"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
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
      <span className={styles.heading}>All Documents Requests</span>
      <div className={styles.eventPageBody}>
        <div className={styles.searchEventsContainer}>
          <span className={styles.searchEventsTitle}>
            Search Student by Address
          </span>
          <input
            className={styles.eventSearchInput}
            type="text"
            placeholder="Student Address"
          />
        </div>
        <div className={styles.exploreEventsContainer}>
          <div className={styles.eventsListGrid}>
            {pendingdescription.map((request, id) => {
              return (
                <div id={id} className={styles.eventBox}>
                  <div className={styles.eventName}>
                    <span>
                      Student Address:{" "}
                      <span className={styles.values}>
                        {request.studentAdd}
                      </span>
                    </span>
                  </div>
                  <div className={styles.eventName}>
                    <span>
                      Student ID:{" "}
                      <span className={styles.values}>{request.studentId}</span>
                    </span>
                  </div>
                  <div className={styles.eventName}>
                    <span>
                      Email ID:{" "}
                      <span className={styles.values}>{request.emailId}</span>
                    </span>
                  </div>
                  <div className={styles.eventName}>
                    <span>
                      Mobile Number:{" "}
                      <span className={styles.values}>{request.mobileNo}</span>
                    </span>
                  </div>
                  <div className={styles.eventName}>
                    <span>
                      Request Type:{" "}
                      <span className={styles.values}>{request.reqType}</span>
                    </span>
                  </div>
                  <div className={styles.eventName}>
                    <span>
                      Document name:{" "}
                      <span className={styles.values}>{request.docName}</span>
                    </span>
                  </div>
                  <div className={styles.eventName}>
                    <span>
                      Department:{" "}
                      <span className={styles.values}>
                        {request.department}
                      </span>
                    </span>
                  </div>
                  <div className={styles.eventName}>
                    <span>
                      Description:{" "}
                      <span className={styles.values}>
                        {request.description}
                      </span>
                    </span>
                  </div>

                  <div className={styles.buttonBox}>
                    {request.reqType === "New" ? (
                      <div>
                        <button onClick={openModal} className={styles.issueBtn}>
                          <span>Issue</span>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={navigateToUpdate}
                          className={styles.issueBtn}
                        >
                          <span>Update</span>
                        </button>
                      </div>
                    )}
                    <div>
                      <button onClick={openModal2} className={styles.rejectBtn}>
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;
