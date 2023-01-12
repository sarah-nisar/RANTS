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
  const [docDetails, setDocDetails] = useState("10th Marksheet Certificate");

  const handleSubmit = () => {};

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
          <span className={styles.detailsHeading}>Request a document</span>
          <form onSubmit={handleSubmit} className={`${styles.formBox}`}>
    
            <div className={`${styles2.inputContainer}`}>
              <label className={`${styles2.inputLabel}`}>Document type</label>
              <select className={`${styles2.input}`}>
                <option>Marksheet</option>
                <option>Transcripts</option>
                <option>Leaving Certificate</option>
              </select>
            </div>

            <div className={`${styles2.inputContainer}`}>
              <label className={`${styles2.inputLabel}`}>Department</label>
              <select className={`${styles2.input}`}>
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
                onChange={(e) => setEmail(e.target.value)}
                value={docDetails}
              />
            </div>
          </form>
        </div>
        <a className={styles.requestFileBtn} href="/">
          <span className="ml-4">Request File</span>
        </a>
      </div>
    </>
  );
};

export default StudentDashboard;
