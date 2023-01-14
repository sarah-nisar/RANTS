import react, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./Update.module.css";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";
import MoonLoader from "react-spinners/MoonLoader";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import * as PDFJS from "pdfjs-dist/webpack";
import axios from "axios";

const Update = () => {
  const navigate = useNavigate();

  let [request, setRequest] = useState({});
  const {
    fetchIndividualRequest,
    uploadFilesToIPFS,
    updateCurrentDoc,
    issueDocument,
  } = useCVPContext();
  const { checkIfWalletConnected, currentAccount } = useAuth();
  const [inputFileName, setInputFileName] = useState("Select file");
  const [inputFile, setInputFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");

  const uploadFile = useRef(null);

  const convertPdfToImages = async (file, qrCode) => {
    const pdfDoc = await PDFDocument.create();

    PDFJS.GlobalWorkerOptions.workerSrc =
      "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

    const images = [];
    const uri = URL.createObjectURL(file);
    const pdf = await PDFJS.getDocument({ url: uri }).promise;
    const canvas = document.createElement("canvas");

    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: 1 });
      var context = canvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      if (i === 0) {
        context.drawImage(qrCode, 50, 50);
      }
      images.push(canvas.toDataURL("image/png"));
      const pngImage = await pdfDoc.embedPng(images[i]);

      const page1 = pdfDoc.addPage();
      page1.drawImage(pngImage);
    }
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputFile == null) {
      toast.error("Please upload file");
      return;
    } else {
      try {
        toast.warn("Please wait for a moment");
        const token = uuidv4();
        console.log(inputFile[0]);
        const qrCode = await QRCode.toCanvas(
          `http://localhost:3000/verify/${token}`
        );

        const pdf = await convertPdfToImages(inputFile[0], qrCode);
        console.log(pdf);

        const files = [new File([pdf], inputFileName)];

        const cid = await uploadFilesToIPFS(files);
        console.log(cid);
        await updateCurrentDoc(
          window.location.pathname.split("/")[2],
          cid,
          "request.docName",
          currentAccount
        );
        await issueDocument(
          window.location.pathname.split("/")[2],
          cid,
          inputFileName,
          token,
          currentAccount
        );
        toast.success("Document updated successfully");
      } catch (err) {
        toast.error("Some error occurred");
      }
    }
  };

  const handleFile = (e) => {
    e.preventDefault();
    uploadFile.current.click();
  };

  const handleFileChange = (e) => {
    setInputFileName(e.target.files[0].name);
    setInputFile(e.target.files);
  };

  const navigateToUrl = (e) => {
    e.preventDefault();
    navigate(url);
  };

  const getRefDocument = useCallback(async (e) => {
    e.preventDefault();
    const docId = window.location.pathname.split("/")[2];
    console.log("docId", docId);
    try {
      await axios
        .post("http://localhost:5000/register/getDocument", { docId })
        .then((res) => {
          setUrl(res.data.data.Url);
          console.log(res.data.data.Url);
          console.log("res", res.data);
          toast.success(res.data.message);
        })
        .catch((err) => {
          console.log("Errrr", err);
          toast.error(err);
        });
      // setUrl(URL);
      console.log("urlll", url);
    } catch (err) {
      toast.error(err);
    }
  });

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
    <>
      <ToastContainer />
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
              className={` ${styles.fileInput}`}
              type="file"
              placeholder={""}
            />
          </div>

          <button
            className={`${styles.modalIssueBtn}`}
            onClick={getRefDocument}
          >
            {isLoading ? (
              <MoonLoader className={styles.loader} color="white" size={20} />
            ) : (
              "Click to view Ref doc link"
            )}
          </button>
          <button className={`${styles.modalIssueBtn}`} onClick={navigateToUrl}>
            {isLoading ? (
              <MoonLoader className={styles.loader} color="white" size={20} />
            ) : (
              "Click to view Ref doc link"
            )}
          </button>
          <button className={`${styles.modalIssueBtn}`} onClick={handleSubmit}>
            {isLoading ? (
              <MoonLoader className={styles.loader} color="white" size={20} />
            ) : (
              "Update"
            )}
          </button>
        </form>
      </div>
    </>
  );
};
export default Update;
