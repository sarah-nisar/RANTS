import react, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./Update.module.css";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";
import MoonLoader from "react-spinners/MoonLoader";

const Update = () => {
  let [request, setRequest] = useState({});
  const { fetchIndividualRequest } = useCVPContext();
  const { checkIfWalletConnected, currentAccount } = useAuth();
  const [inputFileName, setInputFileName] = useState("Select file");
  const [inputFile, setInputFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = useRef(null);

  const handleSubmit = () => {};

  const handleFile = (e) => {
    e.preventDefault();
    uploadFile.current.click();
  };

  const handleFileChange = (e) => {
    setInputFileName(e.target.files[0].name);
    setInputFile(e.target.files);
  };

  useEffect(() => {
    checkIfWalletConnected();
    fetchRequest();
  }, []);

  const fetchRequest = useCallback(async () => {
    try {
      let id = parseInt(window.location.pathname.split("/")[2]);
      const data = await fetchIndividualRequest(id);
      setRequest(data);
      console.log("data2", request);
    } catch (err) {
      console.log("Err", err);
    }
  });

  return (
    <div>
      {" "}
      <div className={styles.heading}>Update Document</div>
      <div className={styles.eventBox}>
        <div className={styles.eventName}>
          <span>
            Student Address:{" "}
            <span className={styles.values}>{request.studentAdd}</span>
          </span>
        </div>
        <div className={styles.eventName}>
          <span>
            Request Type:{" "}
            <span className={styles.values}>{request.reqType}</span>
          </span>
        </div>
        <div className={styles.eventName}>
          <span>
            Document name:{" "}
            <span className={styles.values}>{request.docName}</span>
          </span>
        </div>
        <div className={styles.eventName}>
          <span>
            Department:{" "}
            <span className={styles.values}>{request.department}</span>
          </span>
        </div>
        <div className={styles.eventName}>
          <span>
            Description:{" "}
            <span className={styles.values}>{request.description}</span>
          </span>
        </div>
      </div>
      <form className={styles.formBox}>
        <div className={styles.heading2}>Upload new document</div>
        <div className={styles.inputGroup}>
          <button onClick={handleFile} className={styles.inputCombined}>
            {inputFileName}
          </button>
          <input
            onChange={handleFileChange}
            ref={uploadFile}
            accept="image/*"
            className={` ${styles.fileInput}`}
            type="file"
            placeholder={""}
          />
        </div>

        <button className={`${styles.modalIssueBtn}`} onClick={handleSubmit}>
          {isLoading ? (
            <MoonLoader className={styles.loader} color="white" size={20} />
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
};
export default Update;
