import React from "react";
import styles from "./Admin.module.css";
import { useNavigate } from "react-router-dom";
import templateMarkSheet from '../../images/template.jpg';
import templateLeaving from '../../images/leavingtemplate.png';
import templateTranscript from '../../images/transcripttemplate.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';

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
              style={{backgroundImage: `linear-gradient(#00000000, #0B64CC), url(${templateMarkSheet})`}}
              className={styles.issueDocCard}
              onClick={navigateToMarksheetUpload}
            >
              Mark Sheets
            </div>
            <div className={styles.issueDocCard}
              style={{backgroundImage: `linear-gradient(#00000000, #e74c3c), url(${templateTranscript})`}}
            >Transcripts</div>
            <div className={styles.issueDocCard}
              style={{backgroundImage: `linear-gradient(#00000000, #e67e22), url(${templateLeaving})`}}
            >Leaving Certificate</div>
          </div>
        </div>

        <div className={styles.homePageSection}>
          <span className={styles.issueDocSubHeader}>Quick Actions</span>
          <div className={styles.issueDocGrid}>
            <div className={`${styles.quickActionCard} ${styles.viewDocCard}`}>
              <div className={styles.quickActionCardContent}>
                <AccountCircleIcon style={{marginRight: '0.4rem'}}/>
                View Student Docs
              </div>
            </div>
            <div className={`${styles.quickActionCard} ${styles.viewRequestsCard}`} onClick={navigateToRequests}>
              <div className={styles.quickActionCardContent}>
                <MarkEmailUnreadIcon style={{marginRight: '0.4rem'}}/>
                View Requests
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
