import React from "react";
import styles from "./StudentDashboard.module.css";
import styles2 from "../Register/Register.module.css";
import { useNavigate } from "react-router-dom";
import { useCallback, useState, useEffect, useRef } from "react";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";
import { Description } from "@ethersproject/properties";
import MoonLoader from "react-spinners/MoonLoader";
import { ToastContainer, toast } from "react-toastify";

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Student details
  const [studentDetails, setStudentDetails] = useState([]);

  // Student documents
  const [documents, setDocuments] = useState([]);

  // Pending requests
  const [requests, setRequests] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = useRef(null);

  // Upload request states
  const [docType, setDocType] = useState("Transcripts");
  const [dept, setDept] = useState("Academic Section");

  const details = [
    {
      department: "Academic Section",
      documents: [
        {
          name: "Transcripts",
          val: "Transcripts",
        },
        {
          name: "Leaving Certificate",
          val: "Leaving Certificate",
        },
      ],
    },
    {
      department: "Exam Section",
      documents: [
        {
          name: "Marksheet",
          val: "Marksheet",
        },
      ],
    },
  ];

  const [docDetails, setDocDetails] = useState("");
  const [requestType, setRequestType] = useState("New");
  // Upload request states
  const [inputFileName, setInputFileName] = useState("Select file");
  const [inputFile, setInputFile] = useState(null);

  const [pendingDocDetails, setPendingDocDetails] = useState([
    {
      docType: "Marksheet",
      dept: "Academic",
      docDetails: "Sem 1 Marksheet",
    },
    {
      docType: "Leaving Certificate",
      dept: "Academic",
      docDetails: "12th Leaving Certificate",
    },
  ]);

  const {
    fetchAllDocumentsForStudent,
    getStudent,
    fetchAllRequestsForStudent,
    requestDocument,
    fetchAllRequestsForCollegeStaff,
  } = useCVPContext();
  const { checkIfWalletConnected, currentAccount } = useAuth();

  useEffect(() => {
    checkIfWalletConnected();
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
      const student = await getStudent();
      setStudentDetails(student);
    } catch (err) {
      navigate("/register");
    }
  });

  useEffect(() => {
    if (currentAccount) {
      fetchStudent();
      fetchPendingRequests();
      fetchDocuments();
    }
  }, [currentAccount]);
  const fetchDocuments = useCallback(async () => {
    try {
      const data = await fetchAllDocumentsForStudent();
      setDocuments(data);
      console.log("data", data);
    } catch (err) {
      console.log(err);
    }
  });

  const fetchPendingRequests = useCallback(async () => {
    try {
      console.log("Hello");
      const data = await fetchAllRequestsForStudent();
      console.log("fetchAllRequestsForStudent", data);
      var result = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].status.toNumber() === 1) result.push(data[i]);
      }
      setRequests(result);
    } catch (err) {
      console.log(err);
    }
  });

  const fetchPendingRequests2 = useCallback(async () => {
    try {
      //   console.log("Hello");
      const data2 = await fetchAllRequestsForCollegeStaff();
      console.log("Requests:", data2);
      var result = [];
      for (let i = 0; i < data2.length; i++) {
        if (data2[i].status.toNumber() === 1) result.push(data2[i]);
      }
      //   setPendingdescription(result);
    } catch (err) {
      console.log(err);
    }
  });

  useEffect(() => {
    if (currentAccount) {
      fetchStudent();
      fetchPendingRequests();
      fetchPendingRequests2();
      fetchDocuments();
    }
  }, [currentAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("DocType", docType);
    if (
      docType === "" ||
      dept === "" ||
      docDetails === "" ||
      requestType === ""
    ) {
      toast.error("Enter all details first");
      return;
    }

    try {
      toast.warn("Please wait for a moment");
      await requestDocument(
        currentAccount,
        docType,
        docDetails,
        requestType,
        dept
      );
      toast.success("Document requested sucessfully");
      console.log("Request doc created");
      await fetchPendingRequests();
    } catch (err) {
      toast.error(err);
      console.log(err);
    }
  };

  const handleDocTypeChange = (e) => {
    setDocType(e.target.value);
  };

  const handleRequestTypeChange = (e) => {
    setRequestType(e.target.value);
  };

  const handleDeptChange = (e) => {
    setDept(e.target.value);
  };

  const openDocPage = (ipfsCID, docName) => {
    const win = window.open(`https://${ipfsCID}.ipfs.w3s.link/${docName}`);
    win.focus();
  };

  return (
    <>
      <ToastContainer />
      {studentDetails && studentDetails.length !== 0 ? (
        <div className={styles.studentDashboardContainer}>
          <div className={styles.dashboardBox}>
            <div className={styles.heading}>
              Welcome{" "}
              <span className={styles.accountName}>{studentDetails.name}</span>
            </div>

            <div className={styles.detailsBox}>
              <span className={styles.detailsHeading}>My details</span>
              <div className={styles.detailsBoxContent}>
                <span className={styles.key}>Public Address: </span>
                <span className={styles.name}>{studentDetails.studentAdd}</span>
                <span className={styles.key}>Registration ID: </span>
                <span className={styles.name}>{studentDetails.studentId}</span>
                <span className={styles.key}>VJTI Email ID: </span>
                <span className={styles.name}>{studentDetails.emailId}</span>
              </div>
            </div>

            <div className={styles.detailsBox}>
              <span className={styles.detailsHeading}>My Documents</span>
              {documents.length > 0 ? (
                <>
                  <div className={styles.docCardHeader}>
                    <span className={styles.docCardContent}>Document Name</span>
                    <span className={styles.docCardContent}>Description</span>
                    <span className={styles.docCardContent}>Department</span>
                  </div>
                  {documents.map((item, index) => {
                    return (
                      <div
                        className={
                          index % 2 == 0
                            ? `${styles.docCard} ${styles.evenDocCard}`
                            : `${styles.docCard} ${styles.oddDocCard}`
                        }
                        onClick={() => {
                          openDocPage(item.file.cid, item.docName);
                        }}
                      >
                        <span className={styles.docCardContent}>
                          {item.docName}
                        </span>
                        <span className={styles.docCardContent}>
                          {item.description}
                        </span>
                        <span className={styles.docCardContent}>
                          {item.department}
                        </span>
                      </div>
                    );
                  })}
                </>
              ) : (
                <span className={styles.emptyListMessage}>
                  No documents found
                </span>
              )}
            </div>

            <div className={styles.detailsBox}>
              <span className={styles.detailsHeading}>Pending Requests</span>
              {requests.length > 0 ? (
                <>
                  <div className={styles.docCardHeader}>
                    <span className={styles.docCardContent}>Document Type</span>
                    <span className={styles.docCardContent}>Description</span>
                    <span className={styles.docCardContent}>Department</span>
                  </div>
                  {requests.map((item, index) => {
                    return (
                      <div
                        className={
                          index % 2 == 0
                            ? `${styles.docCard} ${styles.evenDocCard}`
                            : `${styles.docCard} ${styles.oddDocCard}`
                        }
                        onClick={() => {
                          openDocPage(item.file.cid, item.docName);
                        }}
                      >
                        <span className={styles.docCardContent}>
                          {item.docName}
                        </span>
                        <span className={styles.docCardContent}>
                          {item.description}
                        </span>
                        <span className={styles.docCardContent}>
                          {item.department}
                        </span>
                      </div>
                    );
                  })}
                </>
              ) : (
                <span className={styles.emptyListMessage}>
                  No pending requests
                </span>
              )}
            </div>

            <div className={styles.detailsBox}>
              <span className={styles.detailsHeading}>Request a document</span>
              <form className={`${styles.formBox}`}>
                <div className={`${styles2.inputContainer}`}>
                  <label className={`${styles2.inputLabel}`}>
                    Document type
                  </label>
                  <select
                    className={`${styles2.input}`}
                    onChange={handleDocTypeChange}
                  >
                    <option>Marksheet</option>
                    <option>Transcripts</option>
                    <option>Leaving Certificate</option>
                  </select>
                </div>
                <div className={`${styles2.inputContainer}`}>
                  <label className={`${styles2.inputLabel}`}>
                    Request type
                  </label>
                  <select
                    className={`${styles2.input}`}
                    onChange={handleRequestTypeChange}
                  >
                    <option>New</option>
                    <option>Update</option>
                  </select>
                </div>

                <div className={`${styles2.inputContainer}`}>
                  <label className={`${styles2.inputLabel}`}>Department</label>
                  <select
                    className={`${styles2.input}`}
                    onChange={handleDeptChange}
                  >
                    <option>Academic Section</option>
                    <option>Examination Section</option>
                    <option>Scholarship Section</option>
                  </select>
                </div>

                <div className={`${styles2.inputContainer}`}>
                  <label className={`${styles2.inputLabel}`}>
                    Document details
                  </label>
                  <input
                    className={`${styles2.input}`}
                    type="text"
                    placeholder="Enter document details"
                    onChange={(e) => setDocDetails(e.target.value)}
                    value={docDetails}
                  />
                </div>
              </form>
            </div>
            <button className={styles.requestFileBtn} onClick={handleSubmit}>
              Request File
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default StudentDashboard;
