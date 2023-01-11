import React, {useEffect, useState} from "react";
import styles from './MarkSheetUploadPage.module.css';


const MarkSheetUploadPage = () => {
    return (
        <div className={styles.marksheetUploadPageContainer}>
            <div className={styles.marksheetUploadPageBodyContainer}>
                <span className={styles.issueMarksheetHeader}>Issue Marksheet</span>
                <div className={styles.issueMarksheetContainer}>
                    <div className={styles.bulkUploadSection}>Upload Excel Sheet for bulk issue</div>
                    <div className={styles.verticalDivider}></div>
                    <div className={styles.singleUploadSection}>
                        <div className={styles.singleUploadForm}>
                            <span className={styles.inputLabel}>Student Registration Number</span>
                            <input className={styles.regNumInput} type="text" placeholder="Reg Num" />
                            <span className={styles.inputLabel}>Select Mark Sheet PDF</span>
                            <input className={styles.regNumInput} type="text" placeholder="Reg Num" />
                            <span className={styles.inputLabel}>Semester</span>
                            <input className={styles.regNumInput} type="text" placeholder="Reg Num" />
                            <button className={styles.issueBtn}>ISSUE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MarkSheetUploadPage;