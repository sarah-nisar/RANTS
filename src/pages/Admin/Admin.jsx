import React from "react";
import styles from "./Admin.module.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const navigateToMarksheetUpload = () => {
    navigate("/issueMarksheet");
  };

  const navigateToRequests = () => {
    navigate("/requests");
  };

  return (
    <div className={styles.homePageContainer}>
      <div className={styles.homePageBodyContainer}>
        <span className={styles.adminDashboardHeader}>Admin Dashboard</span>
        <div className={styles.homePageSection}>
          <span className={styles.issueDocSubHeader}>Issue Documents</span>
          <div className={styles.issueDocGrid}>
            <div
              className={styles.issueDocCard}
              onClick={navigateToMarksheetUpload}
            >
              Mark Sheets
            </div>
            <div className={styles.issueDocCard}>Transcripts</div>
            <div className={styles.issueDocCard}>Leaving Certificate</div>
          </div>
        </div>

        <div className={styles.homePageSection}>
          <span className={styles.issueDocSubHeader}>Quick Actions</span>
          <div className={styles.issueDocGrid}>
            <div className={styles.issueDocCard}>View Student Docs</div>
            <div className={styles.issueDocCard} onClick={navigateToRequests}>
              View Requests
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
