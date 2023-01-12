import React, { useState } from "react";
import styles from "./Requests.module.css";

const Requests = () => {
  const [pendingDocDetails, setPendingDocDetails] = useState([
    {
      sid: "191070053",
      email: "appatil_b19@ce.vjti.ac.in",
      docType: "Marksheet",
      dept: "Academic",
      docDetails: "Sem 1 Marksheet",
    },
    {
      sid: "191070078",
      email: "abjaiswal_b19@ce.vjti.ac.in",
      docType: "Leaving Certificate",
      dept: "Academic",
      docDetails: "12th Leaving Certificate",
    },
  ]);
  return (
    <div>
      <div className={styles.detailsBox}>
        <span className={styles.heading}>All Documents Requests</span>
        <table className={`table-auto ${styles.table} `}>
          <thead>
            <tr className={styles.tableRow}>
              <th>Student ID</th>
              <th>Email</th>
              <th>Document Type</th>
              <th>Department</th>
              <th>Document Description</th>
            </tr>
          </thead>
          <tbody>
            {pendingDocDetails.map((value, index) => {
              return (
                <tr className={styles.tableRow} key={index}>
                  <td>{value.sid}</td>
                  <td>{value.email}</td>
                  <td>{value.docType}</td>
                  <td>{value.dept}</td>
                  <td>{value.docDetails}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Requests;
