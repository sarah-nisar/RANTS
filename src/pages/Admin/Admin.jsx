import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ms from '../../images/ms.svg';
import lc from '../../images/lc.svg';
import tc from '../../images/tc.svg';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import styles from "./Admin.module.css";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";

const Admin = () => {
  const { getStaffMember } = useCVPContext();
  const { checkIfWalletConnected, currentAccount } = useAuth();

  const [user, setUser] = useState([]);

  useEffect(() => {
    checkIfWalletConnected();
    console.log("Hello");
  }, []);

  const navigateToRegisterStaff = () => {
    navigate("/registerStaff");
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

  useEffect(() => {
    console.log(currentAccount);
    if (currentAccount !== "") fetchStudent();
  }, [currentAccount]);

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
              <img src={ms} className={styles.cardIcon} />
              Mark Sheets
            </div>
            <div className={styles.issueDocCard}
            >
              <img src={tc} className={styles.cardIcon} />
              Transcripts</div>
            <div className={styles.issueDocCard}
            >
              <img src={lc} className={styles.cardIcon} />
              Leaving Certificate</div>
          </div>
        </div>

        <div className={styles.homePageSection}>
          <span className={styles.issueDocSubHeader}>Quick Actions</span>
          <div className={styles.issueDocGrid}>
            <div className={`${styles.quickActionCard} ${styles.viewDocCard}`}>
              <div className={styles.quickActionCardContent}>
                <AccountCircleIcon style={{ marginRight: '0.4rem' }} />
                View Student Docs
              </div>
            </div>
            <div className={`${styles.quickActionCard} ${styles.viewRequestsCard}`} onClick={navigateToRequests}>
              <div className={styles.quickActionCardContent}>
                <MarkEmailUnreadIcon style={{ marginRight: '0.4rem' }} />
                View Requests
              </div>
            </div>
            <div className={`${styles.quickActionCard} ${styles.viewRequestsCard}`} onClick={navigateToRegisterStaff}>
              <div className={styles.quickActionCardContent}>
                <PersonAddAlt1Icon style={{ marginRight: '0.4rem' }} />
                Add Staff Member
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Admin;
