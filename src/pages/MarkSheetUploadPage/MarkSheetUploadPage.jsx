import React, {useEffect, useMemo, useRef, useState} from "react";
import styles from './MarkSheetUploadPage.module.css';
import { useDropzone } from "react-dropzone";
import * as xlsx from 'xlsx';
import Canvas from "./MarkSheetCanvas";
import template from '../../images/template.jpg';

const baseStyle = {
    flex: 1,
    height: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};
  
const MarkSheetUploadPage = () => {

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
    const [bulkEntries, setBulkEntries] = useState([]);
    const templateImage = useRef();

    const files = acceptedFiles.map(file => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    ));

    const draw = (context, entry) => {  
        var img = document.getElementById("templateImage");
        context.drawImage(img, 0, 0, 420, 594);
        context.font = "14px Arial";
        context.fillStyle = "black";
        context.fillText(entry.Name, 95, 176);
        context.fillText(entry.RegNum, 250, 176);
        context.fillText("VII", 350, 176);
        context.fillText(entry.CPI, 122, 543);
        context.fillText(entry.SPI, 305, 543);
    };

    // TODO: Downloads only one, make it download all
    const downloadCanvasImage = () => {
        var canvas = document.getElementById("templateCanvas");
        var url = canvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.download = 'filename.png';
        link.href = url;
        link.click();
    }

    useEffect(() => {
        if(acceptedFiles.length > 0){
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                setBulkEntries(json);

            }
            reader.readAsArrayBuffer(acceptedFiles[0]);
        }
    }, [acceptedFiles]);

    

    return (
        <div className={styles.marksheetUploadPageContainer}>
            <div className={styles.marksheetUploadPageBodyContainer}>
                <span className={styles.issueMarksheetHeader}>Issue Marksheet</span>
                <div className={styles.issueMarksheetContainer}>
                    <div className={styles.bulkUploadSection}>
                        <div {...getRootProps({baseStyle})}>
                            <input {...getInputProps()} />
                            <p>Select Excel File for bulk upload</p>
                        </div>
                        {(bulkEntries.length > 0) && 
                            <div>
                            <span>Generating mark sheets for {bulkEntries.length} students</span>
                            <button onClick={downloadCanvasImage}>Download</button>
                            </div>
                        }  
                    </div>
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
                
                <div className={styles.canvasContainer}>
                    {
                        bulkEntries.map((entry) => {
                            // console.log(entry);
                            return <Canvas entry={entry} draw={draw} height={594} width={420} />
                        })
                    }
                    <img id="templateImage" className={styles.templateImage} height={594} width={420} src={template} />
                </div>
            </div>
        </div>
    );
}

export default MarkSheetUploadPage;