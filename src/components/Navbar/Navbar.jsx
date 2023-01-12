import React from "react";
import styles from './Navbar.module.css';
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();

    const navigateToHome = () => {
        navigate("/");
    }

    return (
        <div className={styles.navbar}>
            <div className={styles.navbarContainer}>
                <div onClick={navigateToHome} className={styles.logoContainer}>
                    vjti.docs
                </div>
                <div className={styles.accountIcon}></div>
            </div>
            
        </div>
    );
}

export default Navbar;