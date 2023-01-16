import React from "react";
import styles from "./StudentDashboard.module.css";
import styles2 from "../Register/Register.module.css";
import { useNavigate } from "react-router-dom";
import { useCallback, useState, useEffect, useRef } from "react";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";
import { Description } from "@ethersproject/properties";
import MoonLoader from "react-spinners/MoonLoader";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Student details
  const [studentDetails, setStudentDetails] = useState([]);

  // Student documents
  const [documents, setDocuments] = useState([]);

  // Pending requests
  const [requests, setRequests] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = useRef(null);

  const [docIdList, setDocIdList] = useState([]);

  // Upload request states
  const [docType, setDocType] = useState("Transcripts");
  const [dept, setDept] = useState("Academic Section");

  const details = [
    {
      department: "Academic Section",
      documents: [
        {
          name: "Transcripts",
          val: "Transcripts",
        },
        {
          name: "Leaving Certificate",
          val: "Leaving Certificate",
        },
      ],
    },
    {
      department: "Exam Section",
      documents: [
        {
          name: "Marksheet",
          val: "Marksheet",
        },
      ],
    },
  ];

  const [docDetails, setDocDetails] = useState("");
  const [requestType, setRequestType] = useState("New");
  // Upload request states
  const [inputFileName, setInputFileName] = useState("Select file");
  const [inputFile, setInputFile] = useState(null);

  const [pendingDocDetails, setPendingDocDetails] = useState([
  ]);

  const {
    fetchAllDocumentsForStudent,
    getStudent,
    fetchAllRequestsForStudent,
    requestDocument,
    fetchAllRequestsForCollegeStaff,
    updateRequestDocument,
  } = useCVPContext();
  const { checkIfWalletConnected, currentAccount } = useAuth();

  useEffect(() => {
    checkIfWalletConnected();
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
      const student = await getStudent();
      setStudentDetails(student);
    } catch (err) {
      navigate("/register");
    }
  });

  useEffect(() => {
    if (currentAccount) {
      fetchStudent();
      fetchPendingRequests();
      fetchDocuments();
    }
  }, [currentAccount]);
  const fetchDocuments = useCallback(async () => {
    try {
      const data = await fetchAllDocumentsForStudent();
      setDocuments(data);
      console.log(data)
      let list = [];
      for (let i = 0; i < data.length; i++) {
        list.push(data[i].docId.toNumber());
      }
      console.log(list)
      setDocIdList(list);
      console.log("data", data);
    } catch (err) {
      console.log(err);
    }
  });

  const fetchPendingRequests = useCallback(async () => {
    try {
      console.log("Hello");
      const data = await fetchAllRequestsForStudent();
      console.log("fetchAllRequestsForStudent", data);
      var result = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].status.toNumber() === 1) result.push(data[i]);
      }
      setRequests(result);
    } catch (err) {
      console.log(err);
    }
  });

  const fetchPendingRequests2 = useCallback(async () => {
    try {
      //   console.log("Hello");
      const data2 = await fetchAllRequestsForCollegeStaff();
      console.log("Requests:", data2);
      var result = [];
      for (let i = 0; i < data2.length; i++) {
        if (data2[i].status.toNumber() === 1) result.push(data2[i]);
      }
      //   setPendingdescription(result);
    } catch (err) {
      console.log(err);
    }
  });

  const [docId, setDocId] = useState(0);

  useEffect(() => {
    if (currentAccount) {
      fetchStudent();
      fetchPendingRequests();
      fetchPendingRequests2();
      fetchDocuments();
    }
  }, [currentAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("DocType", docType);
    if (
      docType === "" ||
      dept === "" ||
      docDetails === "" ||
      requestType === ""
    ) {
      toast.error("Enter all details first");
      return;
    } else {
      if (inputFileName != "Select file") {
        console.log("Input File", inputFile[0]);
        const file = inputFile[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("docId", docId);
        console.log("formdata", formData);
        await axios
          .post("http://localhost:5000/register/toFirestore", formData)
          .then((res) => {
            console.log("res", res);
            toast.success(res.data.message);
          })
          .catch((err) => {
            console.log("Errrr", err);
            toast.error(err);
          });
      }
      //   return;
      try {
        toast.warn("Please wait for a moment");
        console.log(requestType);
        if (requestType == "New") {
          console.log( currentAccount,
            docType,
            docDetails,
            requestType,
            dept)
          await requestDocument(
            currentAccount,
            docType,
            docDetails,
            requestType,
            dept
          );
        } else {
          await updateRequestDocument(
            currentAccount,
            docType,
            docDetails,
            requestType,
            dept,
            docId
          );
        }
        toast.success("Document requested sucessfully");
        console.log("Request doc created");
        await fetchPendingRequests();
      } catch (err) {
        toast.error(err);
        console.log(err);
      }
    }
  };

  const handleDocTypeChange = (e) => {
    setDocType(e.target.value);
  };

  const handleRequestTypeChange = (e) => {
    setRequestType(e.target.value);
  };

  const handleDeptChange = (e) => {
    setDept(e.target.value);
  };
  const handleDocIdChange = (e) => {
    setDocId(e.target.value);
  };

  const openDocPage = (ipfsCID, docName) => {
    const win = window.open(`https://${ipfsCID}.ipfs.w3s.link/${docName}`);
    win.focus();
  };

  return (
    <>
      <ToastContainer />
      {studentDetails && studentDetails.length !== 0 ? (
        <div className={styles.studentDashboardContainer}>
          <div className={styles.dashboardBox}>
            <div className={styles.heading}>
              Welcome{" "}
              <span className={styles.accountName}>{studentDetails.name}</span>
            </div>

            <div className={styles.detailsBox}>
              <span className={styles.detailsHeading}>My details</span>
              <div className={styles.detailsBoxContent}>
                <span className={styles.key}>Public Address: </span>
                <span className={styles.name}>{studentDetails.studentAdd}</span>
                <span className={styles.key}>Registration ID: </span>
                <span className={styles.name}>{studentDetails.studentId}</span>
                <span className={styles.key}>VJTI Email ID: </span>
                <span className={styles.name}>{studentDetails.emailId}</span>
              </div>
            </div>

            <div className={styles.detailsBox}>
              <span className={styles.detailsHeading}>My Documents</span>
              {documents.length > 0 ? (
                <>
                  <div className={styles.docCardHeader}>
                    <span className={styles.docCardContent}>Document Name</span>
                    <span className={styles.docCardContent}>Description</span>
                    <span className={styles.docCardContent}>Department</span>
                  </div>
                  {documents.map((item, index) => {
                    return (
                      <div
                        className={
                          index % 2 == 0
                            ? `${styles.docCard} ${styles.evenDocCard}`
                            : `${styles.docCard} ${styles.oddDocCard}`
                        }
                        onClick={() => {
                          openDocPage(item.file.cid, item.file.fileName);
                        }}
                      >
                        <span className={styles.docCardContent}>
                          {item.docName}
                        </span>
                        <span className={styles.docCardContent}>
                          {item.description}
                        </span>
                        <span className={styles.docCardContent}>
                          {item.department}
                        </span>
                      </div>
                    );
                  })}
                </>
              ) : (
                <span className={styles.emptyListMessage}>
                  No documents found
                </span>
              )}
            </div>

            <div className={styles.detailsBox}>
              <span className={styles.detailsHeading}>Pending Requests</span>
              {requests.length > 0 ? (
                <>
                  <div className={styles.docCardHeader}>
                    <span className={styles.docCardContent}>Document Type</span>
                    <span className={styles.docCardContent}>Description</span>
                    <span className={styles.docCardContent}>Department</span>
                  </div>
                  {requests.map((item, index) => {
                    return (
                      <div
                        className={
                          index % 2 == 0
                            ? `${styles.docCard} ${styles.evenDocCard}`
                            : `${styles.docCard} ${styles.oddDocCard}`
                        }
                        onClick={() => {
                          openDocPage(item.file.cid, item.docName);
                        }}
                      >
                        <span className={styles.docCardContent}>
                          {item.docName}
                        </span>
                        <span className={styles.docCardContent}>
                          {item.description}
                        </span>
                        <span className={styles.docCardContent}>
                          {item.department}
                        </span>
                      </div>
                    );
                  })}
                </>
              ) : (
                <span className={styles.emptyListMessage}>
                  No pending requests
                </span>
              )}
            </div>

            <div className={styles.detailsBox}>
              <span className={styles.detailsHeading}>Request a document</span>
              <form className={`${styles.formBox}`}>
              <div className={`${styles.inputContainer}`}>
								<label className={`${styles.inputLabel}`}>
									Department
								</label>
								<select
									className={`${styles.input}`}
									onChange={(e) => {
										setDept(e.target.value);
										if (
											e.target.value ===
											"Academic Section"
										) {
											setDocType("Transcripts");
										} else {
											setDocType("Marksheet");
										}
									}}
								>
									<option value="Academic Section">
										Academic Section
									</option>
									<option value={"Exam Section"}>
										Examination Section
									</option>
									{/* <option>Scholarship Section</option> */}
								</select>
							</div><div className={`${styles.inputContainer}`}>
								<label className={`${styles.inputLabel}`}>
									Document type
								</label>
								<select
									className={`${styles.input}`}
									onChange={(e) => setDocType(e.target.value)}
								>
									{dept === details[0].department ? (
										details[0].documents.map(
											(item, val) => {
												return (
													<option
														value={item.value}
														key={item.name}
													>
														{item.name}
													</option>
												);
											}
										)
									) : dept === details[1].department ? (
										details[1].documents.map(
											(item, val) => {
												return (
													<option
														value={item.value}
														key={item.name}
													>
														{item.name}
													</option>
												);
											}
										)
									) : (
										<option value="Select">Select</option>
									)}
								</select>
							</div>
							<div className={`${styles.inputContainer}`}>
								<label className={`${styles.inputLabel}`}>
									Request type
								</label>
								<select
									className={`${styles.input}`}
									onChange={(e) =>
										setRequestType(e.target.value)
									}
								>
									<option value={"New"}>New</option>
									<option value={"Update"}>Update</option>
								</select>
							</div>


                

                <div className={`${styles.inputContainer}`}>
                  <label className={`${styles.inputLabel}`}>
                    Document details
                  </label>
                  <input
                    className={`${styles.input}`}
                    type="text"
                    placeholder="Enter document details"
                    onChange={(e) => setDocDetails(e.target.value)}
                    value={docDetails}
                  />
                </div>

                {
                  (requestType === "Update") && <>
                    <div className={`${styles.inputContainer}`}>
                      <label className={`${styles.inputLabel}`}>Doc Id</label>
                      <select
                        className={`${styles.input}`}
                        onChange={handleDocIdChange}
                      >
                        {docIdList.map((id, index) => {
                          return <option key={index}>{id}</option>;
                        })}
                      </select>
                    </div>

                    <div className={`${styles.inputContainer}`}>
                      <label className={`${styles.inputLabel}`}>
                        Upload Ref File
                      </label>
                      <div className={styles.inputUpload}>
                        <button
                          onClick={handleFile}
                          className={styles.inputCombined}
                        >
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
                    </div>
                  </>
                }
                
              </form>
            </div>
            <button className={styles.requestFileBtn} onClick={handleSubmit}>
              {inputFileName == "Select file" ? "Request File" : "Update File"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default StudentDashboard;
