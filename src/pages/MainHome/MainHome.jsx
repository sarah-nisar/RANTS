import React, { useCallback, useEffect, useState } from "react";
import styles from "./MainHome.module.css";
import logo from '../../images/logo.svg';
import bg from '../../images/bg.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from "react-router-dom";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";

const MainHome = () => {
  const navigate = useNavigate();
  const navigateToRegisterPage = () => {
    navigate('/register');
  }

  const { registerStudent, getStudent, getStaffMember } = useCVPContext();
	const { checkIfWalletConnected, currentAccount } = useAuth();

  useEffect(() => {
		checkIfWalletConnected();
	}, []);

  const fetchStudent = useCallback(async () => {
		try {
			const student = await getStudent();
      console.log(student);
			if (student) {
				navigate("/dashboard");
			}
		} catch (err) {
			// console.log(err);
      try{
        const staffMember = await getStaffMember();
        console.log("staff: " + staffMember);
        if(staffMember){
          navigate("/admin");
        }
      }catch(err2){

      }
      
		}
	});

	useEffect(() => {
    console.log("fetching student");
		fetchStudent();
	}, [currentAccount]);

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
        {/* <div>
          <ExpandMoreIcon className={styles.downArrow}/>
        </div> */}
      </div>
    </div>
  );
};

export default MainHome;
