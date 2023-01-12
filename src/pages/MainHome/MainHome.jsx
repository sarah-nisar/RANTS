import React, { useState } from "react";
import styles from "./MainHome.module.css";

const MainHome = () => {
  return (
    <div>
      <a className={styles.registerBtn} href="/register">
        <span className="ml-4">Register</span>
      </a>
      <a className={styles.registerBtn} href="/verify">
        <span className="ml-4">Verify Document</span>
      </a>
    </div>
  );
};

export default MainHome;
