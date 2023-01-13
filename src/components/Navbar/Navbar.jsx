import React, { useEffect } from "react";
import styles from './Navbar.module.css';
import { useNavigate } from "react-router-dom";
import Avatar, { genConfig } from 'react-nice-avatar'
import { useAuth } from "../../Context/AuthContext";
import logo from '../../images/logoblue.svg';

const Navbar = () => {

    const navigate = useNavigate();

    const {checkIfWalletConnected, currentAccount} = useAuth();

    useEffect(() => {
        checkIfWalletConnected();
    },[])

    const navigateToHome = () => {
        navigate("/");
    }
    const config = genConfig(currentAccount);
    return (
        <div className={styles.navbar}>
            <div className={styles.navbarContainer}>
                <div onClick={navigateToHome} className={styles.logoContainer}>
                    <img className={styles.logoImg} src={logo} alt="" />
                    vjti.docs
                </div>
                <div>
                    <Avatar className={styles.avatar} {...config} />
                </div>
            </div>
            
        </div>
    );
}

export default Navbar;