import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import styles from "./LCUploadPage.module.css";
import { useDropzone } from "react-dropzone";
import * as xlsx from "xlsx";
import Canvas from "./LCCanvas";
import template from "../../images/LeavingTemplate.jpeg";
import { useNavigate } from "react-router-dom";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";
import UploadIcon from '@mui/icons-material/Upload';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";

import * as PDFJS from "pdfjs-dist/webpack";

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

const LCUploadPage = () => {
	const navigate = useNavigate();
	const { acceptedFiles, getRootProps, getInputProps,  isFocused,
        isDragAccept,
        isDragReject } = useDropzone();
	const [bulkEntries, setBulkEntries] = useState([]);
	const templateImage = useRef();

	const files = acceptedFiles.map((file) => (
		<li key={file.path}>
			{file.path} - {file.size} bytes
		</li>
	));

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

	const draw = (context, entry) => {
		var img = document.getElementById("templateImage");
		context.drawImage(img, 0, 0, 420, 594);
		context.font = "14px Arial";
		context.fillStyle = "black";
		context.fillText(entry.ID, 66, 165);
		context.fillText(entry.SrNo, 318, 165);
		// context.fillText("VII", 350, 176);
		context.fillText(entry.full_name, 156, 225);
		context.fillText(entry.DOB, 156, 270);
		context.fillText(entry.PlaceOfBirth, 156, 320);
		context.fillText(entry.DateOfAdmission, 156, 365);
		context.fillText(entry.GeneralConduct, 156, 421);
		context.fillText(entry.Remarks, 114, 471);
	};

	const { getStaffMember, uploadFilesToIPFS, uploadBulkDocuments } =
		useCVPContext();
	const { checkIfWalletConnected, currentAccount } = useAuth();

    const downloadCanvasImage = () => {
        var canvases = document.getElementsByClassName("templateCanvas");
        console.log(canvases);
        
        Array.from(canvases).forEach((canvas) => {
            var url = canvas.toDataURL("image/png");
            var link = document.createElement('a');
            link.download = 'filename.png';
            link.href = url;
            link.click();
        })
    }
	const [user, setUser] = useState([]);

	useEffect(() => {
		checkIfWalletConnected();
		console.log("Hello");
	}, []);

	const fetchStudent = useCallback(async () => {
		try {
			const staffMember = await getStaffMember();
			console.log(staffMember);
			setUser(staffMember);
		} catch (err) {
			navigate("/register");
		}
	});

	useEffect(() => {
		console.log(currentAccount);
		if (currentAccount !== "") fetchStudent();
	}, [currentAccount]);


	const uploadRecord = useRef();
	const [docFileName, setDocFileName] = useState("");
	const [docFile, setDocFile] = useState("");

	const [emailId, setEmailId] = useState("");
	const [docName, setDocName] = useState("Leaving Certificate");
	const [description, setDescription] = useState("");

	const handleDocUpload = (e) => {
		e.preventDefault();
		uploadRecord.current.click();
	};

	const handleDocFileChange = (e) => {
		setDocFileName(e.target.files[0].name);
		setDocFile(e.target.files);
	};

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
			await page.render({ canvasContext: context, viewport: viewport })
				.promise;
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

		const token = uuidv4();
		console.log(docFile[0]);
		const qrCode = await QRCode.toCanvas(
			`http://localhost:3000/verify/${token}`
		);

		const pdf = await convertPdfToImages(docFile[0], qrCode);
		console.log(pdf);

		const files = [new File([pdf], "LC.pdf")];

		const cid = await uploadFilesToIPFS(files);
		console.log(cid);

		await uploadBulkDocuments(
			[cid],
			docName,
			description,
			[emailId],
			[docFileName],
			currentAccount,
			[token]
		);
	};

	useEffect(() => {
		if (acceptedFiles.length > 0) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const data = e.target.result;
				const workbook = xlsx.read(data, { type: "array" });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];
				const json = xlsx.utils.sheet_to_json(worksheet);
				setBulkEntries(json);
			};
			reader.readAsArrayBuffer(acceptedFiles[0]);
		}
	}, [acceptedFiles]);

	return (
		<div className={styles.marksheetUploadPageContainer}>
			<div className={styles.marksheetUploadPageBodyContainer}>
				<span className={styles.issueMarksheetHeader}>
					Issue Leaving Certificate
				</span>
				<div className={styles.issueMarksheetContainer}>
					<div className={styles.bulkUploadSection}>
						<div {...getRootProps({ style })}>
							<input {...getInputProps()} />
                            <UploadIcon />
							<p>Select Excel File for bulk upload</p>
						</div>
						{bulkEntries.length > 0 && (
							<div>
								<span>
									Generating leaving certificates for{" "}
									{bulkEntries.length} students
								</span>
								<button onClick={downloadCanvasImage}>
									Download
								</button>
							</div>
						)}
					</div>
					<div className={styles.verticalDivider}></div>
					<div className={styles.singleUploadSection}>
						<div className={styles.singleUploadForm}>
							<span className={styles.inputLabel}>
								Student Email Id
							</span>
							<input
								className={styles.regNumInput}
								type="text"
								value={emailId}
								placeholder="Email"
								onChange={(e) => setEmailId(e.target.value)}
							/>
							<span className={styles.inputLabel}>
								Document name
							</span>
							<input
								className={styles.regNumInput}
								type="text"
								placeholder="Name"
								value={docName}
								onChange={(e) => setDocName(e.target.value)}
							/>
							<span className={styles.inputLabel}>
								Document description
							</span>
							<input
								className={styles.regNumInput}
								type="text"
								value={description}
								placeholder="Description"
								onChange={(e) => setDescription(e.target.value)}
							/>
							<span className={styles.inputLabel}>
								Select LC PDF
							</span>

							<div className="mt-1">
								<input
									type="file"
									id="formFile"
									onChange={handleDocFileChange}
									className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
								/>
							</div>
						</div>
						<button className={styles.issueDocBtn} onClick={handleSubmit}>
                            <TaskAltIcon className={styles.tickIcon}/> Issue</button>
					</div>
				</div>

				<div className={styles.canvasContainer}>
					{bulkEntries.map((entry) => {
						// console.log(entry);
						return (
							<Canvas
								entry={entry}
								draw={draw}
								height={594}
								width={420}
							/>
						);
					})}
					<img
						id="templateImage"
						className={styles.templateImage}
						height={594}
						width={420}
						src={template}
					/>
				</div>
			</div>
		</div>
	);
};

export default LCUploadPage;