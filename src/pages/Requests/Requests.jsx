import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useCVPContext } from "../../Context/CVPContext";
import styles from "./Requests.module.css";
import Modal from "react-modal";
import CloseIcon from "@mui/icons-material/Close";
import MoonLoader from "react-spinners/MoonLoader";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";
import * as PDFJS from "pdfjs-dist/webpack";
import { async } from "q";
import { ToastContainer, toast } from "react-toastify";
import axios from "../../helpers/axios";
import { ethers } from "ethers";
import { off } from "process";

const Requests = () => {
  const {
    getStaffMember,
    fetchAllRequestsForCollegeStaff,
    getStudentByAddress,
    uploadFilesToIPFS,
    uploadBulkDocuments,
    fetchIndividualRequest,
    issueDocument,
    isOwnerAddress,
  } = useCVPContext();
  const { checkIfWalletConnected, currentAccount } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  const [_reqId, set_ReqId] = useState(0);
  const [_email, set_Email] = useState("");
  const [user, setUser] = useState([]);
  const [comment, setComment] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [inputFileName, setInputFileName] = useState("Select file");
  const [inputFile, setInputFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reqId, setReqId] = useState("");
  const [description, setDescription] = useState("");
  const [emailId, setEmailId] = useState("");
  const [docFileName, setDocFileName] = useState("");

  function closeModal() {
    setModalIsOpen(false);
  }
  function closeModal2() {
    setModalIsOpen2(false);
  }

  const convertPdfToImages = async (file, qrCode) => {
    const pdfDoc = await PDFDocument.create();

    PDFJS.GlobalWorkerOptions.workerSrc =
      "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

    const images = [];
    const uri = URL.createObjectURL(file);
    console.log("uri", uri);
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
      toast.error("Please upload a file");
    } else {
      toast.warn("Please wait for a moment");
      const token = uuidv4();
      // console.log(docFile[0]);
      const qrCode = await QRCode.toCanvas(
        `http://localhost:3000/verify/${token}`
      );

      console.log("inputFIle", inputFile);
      const pdf = await convertPdfToImages(inputFile[0], qrCode);
      console.log("pdf", pdf);

      const files = [new File([pdf], inputFileName)];

      const cid = await uploadFilesToIPFS(files);
      console.log("cid", cid);

      console.log(
        [cid],
        inputFileName,
        description,
        [emailId],
        [docFileName],
        currentAccount,
        [token]
      );

      console.log(pendingdescription[reqId]);
      // console.log([cid], inputFileName, [emailId], pendingdescription[reqId].)
      await issueDocument(_reqId, cid, inputFileName, token, currentAccount);
      toast.success("Document issued successfully");
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    if (comment == "") {
      toast.error("Please specify comment");
    } else {
      console.log("email", _email, "reqid", _reqId);
      await axios
        .post("/register/comment", { comment, _reqId, _email })
        .then((res) => {
          console.log("res", res);
          toast.success(res.data.message);
        })
        .catch((err) => {
          console.log("Errrr", err);
          toast.error(err);
        });
    }
  };

  //   const handleSubmit2
  const openModal = async (e) => {
    e.preventDefault();
    console.log("_reqid", _reqId);
    setModalIsOpen(true);
  };
  const openModal2 = async (e) => {
    e.preventDefault();
    setModalIsOpen2(true);
  };

  const uploadFile = useRef(null);

  useEffect(() => {
    checkIfWalletConnected();
    console.log("Hello");
  }, []);

  const handleFile = (e) => {
    e.preventDefault();
    uploadFile.current.click();
  };

  const handleFileChange = (e) => {
    setInputFileName(e.target.files[0].name);
    setInputFile(e.target.files);
  };

  const fetchStudent = useCallback(async () => {
    try {
      const staffMember = await getStaffMember();
      const owner = await isOwnerAddress();
      console.log(staffMember);
      console.log(owner);
      setIsOwner(owner);
      console.log(staffMember);
      setUser(staffMember);
    } catch (err) {
      navigate("/register");
    }
  });

  const fetchDocForStudent = useCallback(async (_reqId) => {
    try {
      const data = await fetchIndividualRequest(_reqId);
      var result = 0;
      console.log("asdf", data);
      console.log("daaaaataaaaaa", data.docId);
      navigate(`/update/${_reqId}`);
    } catch (err) {
      toast.error(err)
    }
  });

  const fetchPendingRequests = useCallback(async () => {
    try {
      //   console.log("Hello");
      const data = await fetchAllRequestsForCollegeStaff();
      var resData = [];
      console.log(data);
      console.log("Requests:", data);

      try {
        for (let j = 1; j < data.length; j++) {
          const studentData = await getStudentByAddress(data[j].studentAdd);
          console.log("studentData", typeof studentData);
          if (data[j].status.toNumber() !== 0)
            resData.push({
              reqId: data[j].reqId.toNumber(),
              studentAdd: data[j].studentAdd,
              docName: data[j].docName,
              department: data[j].department,
              description: data[j].description,
              reqType: data[j].reqType,
              studentId: studentData.studentId,
              emailId: studentData.emailId,
              mobileNo: studentData.mobileNo,
            });
          setReqId(data[j].reqId);
        }
        console.log("data", resData);
      } catch (err) {
        console.log(err);
      }
      setPendingdescription(resData);
    } catch (err) {
      console.log(err);
    }
  });

  useEffect(() => {
    console.log(currentAccount);
    if (currentAccount !== "") {
      fetchStudent();
      fetchPendingRequests();
    }
  }, [currentAccount]);

  const navigate = useNavigate();

  const [pendingdescription, setPendingdescription] = useState([{}]);
  return (
    <>
      <ToastContainer />
      <div className={styles.detailsBox}>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Input File"
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          <div className={styles.modalContainer}>
            <button className={styles.closeButton} onClick={closeModal}>
              <CloseIcon />
            </button>
            <h2
              className={styles.heading}
              style={{
                width: "100%",
                textAlign: "center",
              }}
            >
              Input File
            </h2>

            <form className={styles.formBox}>
              <div className={styles.inputGroup}>
                <button onClick={handleFile} className={styles.inputCombined}>
                  {inputFileName}
                </button>
                <input
                  onChange={handleFileChange}
                  ref={uploadFile}
                  // accept="pdf/*"
                  className={` ${styles.fileInput}`}
                  type="file"
                  placeholder={""}
                />
              </div>

              <button
                className={`${styles.modalIssueBtn}`}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <MoonLoader
                    className={styles.loader}
                    color="white"
                    size={20}
                  />
                ) : (
                  "Issue"
                )}
              </button>
            </form>
          </div>
        </Modal>
        <Modal
          isOpen={modalIsOpen2}
          onRequestClose={closeModal2}
          contentLabel="Comment"
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          <div className={styles.modalContainer}>
            <button className={styles.closeButton} onClick={closeModal2}>
              <CloseIcon />
            </button>
            <h2
              className={styles.heading}
              style={{
                width: "100%",
                textAlign: "center",
              }}
            >
              Enter your comments
            </h2>

            <form className={styles.formBox}>
              <div className={styles.inputGroup}>
                <input
                  className={`${styles.input}`}
                  style={{
                    resize: "none",
                  }}
                  type="text"
                  placeholder="Enter comment"
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                />
              </div>

              <button
                className={`${styles.submitButton}`}
                onClick={handleSubmit2}
              >
                {isLoading ? (
                  <MoonLoader
                    className={styles.loader}
                    color="white"
                    size={20}
                  />
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </Modal>
        <span className={styles.heading}>All Documents Requests</span>
        <div className={styles.eventPageBody}>
          <div className={styles.searchEventsContainer}>
            <span className={styles.searchEventsTitle}>
              Search Student by Address
            </span>
            <input
              className={styles.eventSearchInput}
              type="text"
              placeholder="Student Address"
            />
          </div>
          <div className={styles.exploreEventsContainer}>
            <div className={styles.eventsListGrid}>
              {pendingdescription.map((request, id) => {
                return (
                  <div id={id} className={styles.eventBox}>
                    <div className={styles.eventName}>
                      <span>
                        Student Address:{" "}
                        <span className={styles.values}>
                          {request.studentAdd}
                        </span>
                      </span>
                    </div>
                    <div className={styles.eventName}>
                      <span>
                        Student ID:{" "}
                        <span className={styles.values}>
                          {request.studentId}
                        </span>
                      </span>
                    </div>
                    <div className={styles.eventName}>
                      <span>
                        Email ID:{" "}
                        <span className={styles.values}>{request.emailId}</span>
                      </span>
                    </div>
                    <div className={styles.eventName}>
                      <span>
                        Mobile Number:{" "}
                        <span className={styles.values}>
                          {request.mobileNo}
                        </span>
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
                        <span className={styles.values}>
                          {request.department}
                        </span>
                      </span>
                    </div>
                    <div className={styles.eventName}>
                      <span>
                        Description:{" "}
                        <span className={styles.values}>
                          {request.description}
                        </span>
                      </span>
                    </div>
                    <div className={styles.buttonBox}>
                      {request.reqType === "New" ? (
                        <div>
                          <button
                            onClick={(e) => {
                              openModal(e);
                              set_ReqId(request.reqId);
                            }}
                            className={styles.issueBtn}
                          >
                            <span>Issue</span>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            onClick={() => {
                              fetchDocForStudent(
                                request.reqId
                              );
                            }}
                            className={styles.issueBtn}
                          >
                            <span>Update</span>
                          </button>
                        </div>
                      )}
                      <div>
                        <button
                          onClick={(e) => {
                            openModal2(e);
                            set_ReqId(request.reqId);
                            set_Email(request.emailId);
                          }}
                          className={styles.rejectBtn}
                        >
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Requests;
