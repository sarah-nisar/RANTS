import React from "react";
import styles from "./StudentDashboard.module.css";
import styles2 from "../Register/Register.module.css";
import { useNavigate } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";
import { Description } from "@ethersproject/properties";

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Student details
  const [studentDetails, setStudentDetails] = useState([]);

  // Student documents
  const [documents, setDocuments] = useState([]);

  // Pending requests
  const [requests, setRequests] = useState([]);

  // Upload request states
  const [docType, setDocType] = useState("Marksheet");
  const [dept, setDept] = useState("Academic Section");
  const [docDetails, setDocDetails] = useState("");
  const [requestType, setRequestType] = useState("");

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

  const fetchStudent = useCallback(async () => {
    try {
      const student = await getStudent();
      setStudentDetails(student);
    } catch (err) {
      navigate("/register");
    }
  });

  const fetchDocuments = useCallback(async () => {
    try {
      const data = await fetchAllDocumentsForStudent();
      setDocuments(data);
      console.log(data);
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

  const handleDeptChange = (e) => {
    setDept(e.target.value);
  };

  const handleDocTypeChnage = (e) => {
    setDocType(e.target.value);
  };

  const handleRequestTypeChange = (e) => {
    setRequestType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("DocType", docType);
    if (
      docType === "" ||
      dept === "" ||
      docDetails === "" ||
      requestType === ""
    ) {
      alert("Enter all details first");
      return;
    }

    try {
      await requestDocument(
        currentAccount,
        docType,
        docDetails,
        requestType,
        dept
      );
      console.log("Request doc created");
      await fetchPendingRequests();
      await fetchPendingRequests2();
    } catch (err) {
      console.log(err);
    }
  };

  const openDocPage = (ipfsCID, docName) => {
    const win = window.open(`https://${ipfsCID}.ipfs.w3s.link/${docName}`);
    win.focus();
  };

  return (
    <>
      {studentDetails && studentDetails.length !== 0 ? (
        <div className={styles.dashboardBox}>
          <div className={styles.heading}>
            Welcome <span className={styles.name}>{studentDetails.name}</span>
          </div>

          <div className={styles.detailsBox}>
            <span className={styles.detailsHeading}>My details</span>
            <div className={styles.details}>
              Public Address:{" "}
              <span className={styles.name}>{studentDetails.studentAdd}</span>
            </div>
            <div className={styles.details}>
              Registration ID:{" "}
              <span className={styles.name}>{studentDetails.studentId}</span>
            </div>
            <div className={styles.details}>
              VJTI Email ID:{" "}
              <span className={styles.name}>{studentDetails.emailId}</span>
            </div>
          </div>

          <div className={styles.detailsBox}>
            <span className={styles.detailsHeading}>My Documents</span>
            {documents.map((item, index) => {
              return (
                <div
                  className={styles.docCard}
                  onClick={() => {
                    openDocPage(item.ipfsCID, item.docName);
                  }}
                >
                  <span>Document Name: {item.docName}</span>
                  <span>Description: {item.description}</span>
                  <span>Department: {item.department}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.detailsBox}>
            <span className={styles.detailsHeading}>Pending Requests</span>
            <table className={`table-auto ${styles.table} `}>
              <thead>
                <tr className={styles.tableRow}>
                  <th>Document Type</th>
                  <th>Department</th>
                  <th>Document Description</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((value, index) => {
                  return (
                    <tr className={styles.tableRow} key={index}>
                      <td>{value.docName}</td>
                      <td>{value.department}</td>
                      <td>{value.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.detailsBox}>
            <span className={styles.detailsHeading}>Request a document</span>
            <form className={`${styles.formBox}`}>
              <div className={`${styles2.inputContainer}`}>
                <label className={`${styles2.inputLabel}`}>Document type</label>
                <select
                  className={`${styles2.input}`}
                  onChange={handleDocTypeChnage}
                >
                  <option>Marksheet</option>
                  <option>Transcripts</option>
                  <option>Leaving Certificate</option>
                </select>
              </div>
              <div className={`${styles2.inputContainer}`}>
                <label className={`${styles2.inputLabel}`}>Request type</label>
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
      ) : null}
    </>
  );
};

export default StudentDashboard;
