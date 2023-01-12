import React from "react";
import styles from "./StudentDashboard.module.css";
import styles2 from "../Register/Register.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const StudentDashboard = () => {
  const [name, setName] = useState("Atharva");
  const [pubAddr, setPubAddr] = useState(
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
  );
  const [sid, setSid] = useState("191070053");
  const [email, setEmail] = useState("appatil_b19@ce.vjti.ac.in");
  const [docType, setDocType] = useState("Select");
  const [dept, setDept] = useState("Select");
  const [docDetails, setDocDetails] = useState("");
  const [pendingDocDetails, setPendingDocDetails] = useState([
    { docType: "Marksheet", dept: "Academic", docDetails: "Sem 1 Marksheet" },
    {
      docType: "Leaving Certificate",
      dept: "Academic",
      docDetails: "12th Leaving Certificate",
    },
  ]);

  const handleDeptChange = (e) => {
    setDept(e.target.value);
  };

  const handleDocTypeChnage = (e) => {
    setDocType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("DocType", docType);
    if (docType === "Select" || dept === "Select" || docDetails === "") {
      alert("Enter all details first");
      return;
    }
    setPendingDocDetails()
  };

  return (
    <>
      <div className={styles.dashboardBox}>
        <div className={styles.heading}>
          Welcome <span className={styles.name}>{name}</span>
        </div>
        <div className={styles.detailsBox}>
          <span className={styles.detailsHeading}>My details</span>
          <div className={styles.details}>
            Public Address: <span className={styles.name}>{pubAddr}</span>
          </div>
          <div className={styles.details}>
            Registration ID: <span className={styles.name}>{sid}</span>
          </div>
          <div className={styles.details}>
            VJTI Email ID: <span className={styles.name}>{email}</span>
          </div>
        </div>
        <div className={styles.detailsBox}>
          <span className={styles.detailsHeading}>My Documents</span>
          <div className={styles.details}>
            Public Address: <span className={styles.name}>{pubAddr}</span>
          </div>
          <div className={styles.details}>
            Registration ID: <span className={styles.name}>{sid}</span>
          </div>
          <div className={styles.details}>
            VJTI Email ID: <span className={styles.name}>{email}</span>
          </div>
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
              {pendingDocDetails.map((value, index) => {
                return (
                  <tr className={styles.tableRow} key={index}>
                    <td>{value.docType}</td>
                    <td>{value.dept}</td>
                    <td>{value.docDetails}</td>
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
                <option>Select</option>
                <option>Marksheet</option>
                <option>Transcripts</option>
                <option>Leaving Certificate</option>
              </select>
            </div>

            <div className={`${styles2.inputContainer}`}>
              <label className={`${styles2.inputLabel}`}>Department</label>
              <select
                className={`${styles2.input}`}
                onChange={handleDeptChange}
              >
                <option>Select</option>
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
                type="textarea"
                placeholder="Enter document details"
                onChange={(e) => setDocDetails(e.target.value)}
                value={docDetails}
              />
            </div>
          </form>
        </div>
        <a className={styles.requestFileBtn} onClick={handleSubmit}>
          <span className="ml-4">Request File</span>
        </a>
      </div>
    </>
  );
};

export default StudentDashboard;
