import React, { useState } from "react";
import styles from "./MainHome.module.css";
import logo from '../../images/logo.svg';
import bg from '../../images/bg.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from "react-router-dom";

const MainHome = () => {
  const navigate = useNavigate();
  const navigateToRegisterPage = () => {
    navigate('/register');
  }

  return (
    <div className={styles.homePageContainer}>
      <div style={{backgroundImage: `url(${bg})`}} className={styles.heroSection}>
        <div className={styles.logoSection}>
          <img className={styles.logoImg} src={logo} alt="" />
          vjti.docs
        </div>
        <div className={styles.descSection}>
          <span>Building safe & secure solution<br />
for Certificate Verification</span>
          <button onClick={navigateToRegisterPage} className={styles.registerBtn}>
            Register
            <ArrowForwardIcon className={styles.arrowForwardIcon}/>
          </button>

        </div>
        <div>
          <ExpandMoreIcon className={styles.downArrow}/>
        </div>
      </div>
    </div>
  );
};

export default MainHome;
