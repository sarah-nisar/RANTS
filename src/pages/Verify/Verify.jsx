import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useCVPContext } from "../../Context/CVPContext";
import styles from "./Verify.module.css";
import { Jwt } from "jsonwebtoken";
import { useJwt, decodeToken } from "react-jwt";
import { Web3Storage } from "web3.storage";
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { useDropzone } from "react-dropzone";
import UploadIcon from '@mui/icons-material/Upload';
import { sha256 } from 'crypto-hash';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const baseStyle = {
	flex: 1,
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

const focusedStyle = {
	borderColor: '#2196f3'
};

const acceptStyle = {
	borderColor: '#00e676'
};

const rejectStyle = {
	borderColor: '#ff1744'
};


const Verify = () => {
	const token = window.location.pathname.split("/")[2];
	const [document, setDocument] = useState([]);
	const [isVerified, setIsVerified] = useState(false);
	const { verifyDocument } = useCVPContext();
	const { checkIfWalletConnected, currentAccount } = useAuth();
	const [cid, setCID] = useState("");
	const [isVerifiedCorrect, setIsVerifiedCorrect] = useState(0);
	const [verifiedDocData, setVerifiedDocData] = useState({});

	const { acceptedFiles, getRootProps, getInputProps, isFocused,
		isDragAccept,
		isDragReject } = useDropzone();

	useEffect(() => {
		checkIfWalletConnected();
	}, []);

	useEffect(() => {
		if (currentAccount === "") checkIfWalletConnected();
	}, [currentAccount]);

	const verify = async () => {
		try {
			console.log("Hello");
			// const data = await verifyDocument(token);
			// setDocument(data);
			// TODO: Decode using jwt
			// setCID(cid);
		} catch (err) {
			console.log(err);
		}
	};


	// const [numPages, setNumPages] = useState(null);
	// const [pageNumber, setPageNumber] = useState(1);
	const [pdfFile, setPdfFile] = useState(null);

	

	async function retrieve(cid) {
		const web3AccessToken =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEFjNjkxYTc1NTFBODU3MzIzMTE2MWZEMzUyMUFEQ0MyNWFEQzIyOWMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzE3ODk2NzI1MjUsIm5hbWUiOiJIYWNrQU1pbmVycyJ9._DQqNUq6VZ-Zg86ol1YHB0L4sWFtowhD6SSdSIRR23Y";
		const client = new Web3Storage({ token: web3AccessToken });
		const res = await client.get(cid);

		console.log(`Got a response! [${res.status}] ${res.statusText}`)
		if (!res.ok) {
			throw new Error(`failed to get ${cid}`)
		}

		const files = await res.files()
		for (const file of files) {
			// console.log(typeof(file))

			console.log(`${file.cid} -- ${file.path} -- ${file.size}`)
			const objectURL = global.URL.createObjectURL(file);
			// setPdfFile(objectURL);
			// const len = file.length;
			// const bytes = new Uint8Array(len);
			// for(let i = 0; i < len; i++){
			// 	bytes[i] = file.charCodeAt(i);
			// }
			setPdfFile(file);
			var link = global.document.createElement('a');
			link.download = file.name; // this name is used when the user downloads the file
			link.href = objectURL;
			link.click();
		}
		console.log("ravi")
		// request succeeded! do something with the response object here...
	}

	

	const compareTwoDocs = async () => {
		// console.log("comparing")
		const file1array = await acceptedFiles[0].arrayBuffer();
		const file2array = await pdfFile.arrayBuffer();
		const file1hash = await sha256(file1array);
		const file2hash = await sha256(file2array);
		console.log(file1hash)
		console.log(file2hash)
		if (file1hash === file2hash) {
			setIsVerifiedCorrect(1);
		} else {
			setIsVerifiedCorrect(2);
		}
	}

	const [bulkEntries, setBulkEntries] = useState([]);

	const style = useMemo(() => ({
		...baseStyle,
		...(isFocused ? focusedStyle : {}),
		...(isDragAccept ? acceptStyle : {}),
		...(isDragReject ? rejectStyle : {})
	}), [
		isFocused,
		isDragAccept,
		isDragReject
	]);

	const checkDocument = async (e) => {
		e.preventDefault();
		const data = await verifyDocument(token);
		console.log(data)
		if (data.file) {
			setIsVerified(true);
			setVerifiedDocData(data);
			retrieve(data.file.cid);
		}
	}

	return (
		<div className={styles.verifyPageContainer}>
			{
				(!isVerified) ? <div className={styles.beforeVerifyContainer}>
					<span className={styles.verifyDetails}>Doc Name: <span className={styles.detailsContent}>gradesheet.pdf</span></span>
					<span className={styles.verifyDetails}>Student Email: <span className={styles.detailsContent}>rrmaurya_b19@it.vjti.ac.in</span></span>
					<span className={styles.verifyDetails}>Student Registration Num: <span className={styles.detailsContent}>191080080</span></span>
					<button onClick={checkDocument} className={styles.checkDocBtn}>Check Document</button>
				</div> :
					<div className={styles.docViewContainer}>

						<PDFViewer pdfFile={pdfFile}/>

						<div className={styles.uploadContainer}>
							<div className={styles.bulkUploadSection}>
								<div {...getRootProps({ style })}>
									<input {...getInputProps()} />
									<UploadIcon />
									<p>{acceptedFiles.length > 0 ? `${acceptedFiles[0].path}` : 'Select Submitted Doc for comparison'}</p>
								</div>
								{acceptedFiles.length > 0 && (

									<div>
										<button className={styles.compareBtn} onClick={compareTwoDocs}>Compare Docs</button>
										<span className={styles.verifiedStatus}>
											{
												(isVerifiedCorrect != 0) ? (
													(isVerifiedCorrect === 1) ? <>
														<TaskAltIcon className={styles.tickIcon} /> Verified!
													</> : <div className={styles.errorMessage}>
														<ErrorOutlineOutlinedIcon className={styles.tickIcon} /> Forged!
													</div>
												) : <></>
											}
										</span>
									</div>
								)}
							</div>
						</div>


					</div>
			}


		</div>
	);
};


const PDFViewer = ({pdfFile}) => {

	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);

	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
	}

	const turnLeft = () => {
		setPageNumber(Math.max(1, pageNumber - 1));
		console.log(pageNumber);
	}

	const turnRight = () => {
		setPageNumber(Math.min(numPages, pageNumber + 1));
		console.log(pageNumber);
	}

	return (<div className={styles.docContainer}>
		{(pdfFile) ?
			<div className={styles.documentContainer}>
				<Document file={window.URL.createObjectURL(pdfFile)} onLoadSuccess={onDocumentLoadSuccess}>
					<Page className={styles.pdfPage} pageNumber={pageNumber} />
				</Document>
			</div>
			: "Its nulll"}
		<div className={styles.pageControllerContainer}>
			<button className={styles.leftPageBtn} onClick={turnLeft}><ArrowBackIcon /></button>
			<span className={styles.pageInfoContainer}>{pageNumber} of {numPages}</span>
			<button className={styles.rightPageBtn} onClick={turnRight}><ArrowForwardIcon /></button>
		</div>
	</div>);
}

export default Verify;
