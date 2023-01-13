import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import styles from "./MarkSheetUploadPage.module.css";
import { useDropzone } from "react-dropzone";
import * as xlsx from "xlsx";
import Canvas from "./MarkSheetCanvas";
import template from "../../images/template.jpg";
import { useNavigate } from "react-router-dom";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";
import UploadIcon from "@mui/icons-material/Upload";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import PDFJS from "pdfjs-dist";
import e from "cors";

const baseStyle = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	padding: "20px",
	borderWidth: 2,
	borderRadius: 2,
	borderColor: "#eeeeee",
	borderStyle: "dashed",
	backgroundColor: "#fafafa",
	color: "#bdbdbd",
	outline: "none",
	transition: "border .24s ease-in-out",
};

const focusedStyle = {
	borderColor: "#2196f3",
};

const acceptStyle = {
	borderColor: "#00e676",
};

const rejectStyle = {
	borderColor: "#ff1744",
};

const MarkSheetUploadPage = () => {
	const navigate = useNavigate();
	const {
		acceptedFiles,
		getRootProps,
		getInputProps,
		isFocused,
		isDragAccept,
		isDragReject,
	} = useDropzone();
	const [bulkEntries, setBulkEntries] = useState([]);
	const [tokens, setTokens] = useState([]);
	const templateImage = useRef();

	const files = acceptedFiles.map((file) => (
		<li key={file.path}>
			{file.path} - {file.size} bytes
		</li>
	));

	const style = useMemo(
		() => ({
			...baseStyle,
			...(isFocused ? focusedStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {}),
		}),
		[isFocused, isDragAccept, isDragReject]
	);

	const draw = async (context, entry) => {
		var img = document.getElementById("templateImage");
		context.drawImage(img, 0, 0, 420, 594);
		context.font = "14px Arial";
		context.fillStyle = "black";
		context.fillText(entry.Name, 95, 176);
		context.fillText(entry.RegNum, 250, 176);
		context.fillText("VII", 350, 176);
		context.fillText(entry.CPI, 122, 543);
		context.fillText(entry.SPI, 305, 543);

		const token = uuidv4();
		const qrCode = await QRCode.toCanvas(
			`http://localhost:3000/verify/${token}`
		);

		context.drawImage(qrCode, 0, 0);
		setTokens([...tokens, token]);
	};

	const { getStaffMember, uploadFilesToIPFS, uploadBulkDocuments } =
		useCVPContext();
	const { checkIfWalletConnected, currentAccount } = useAuth();

	const downloadCanvasImage = () => {
		var canvases = document.getElementsByClassName("templateCanvas");
		console.log(canvases);

		Array.from(canvases).forEach((canvas) => {
			var url = canvas.toDataURL("image/png");
			var link = document.createElement("a");
			link.download = "filename.png";
			link.href = url;
			link.click();
		});
	};
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
	const [docName, setDocName] = useState("Marksheet");
	const [description, setDescription] = useState("");

	const handleDocUpload = (e) => {
		e.preventDefault();
		uploadRecord.current.click();
	};

	const handleDocFileChange = (e) => {
		setDocFileName(e.target.files[0].name);
		setDocFile(e.target.files);
	};

	const readFileData = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				resolve(e.target.result);
			};
			reader.onerror = (err) => {
				reject(err);
			};
			reader.readAsDataURL(file);
		});
	};

	//param: file -> the input file (e.g. event.target.files[0])
	//return: images -> an array of images encoded in base64
	const convertPdfToImages = async (file) => {
		const images = [];
		console.log(file);
		const data = await readFileData(file);
		console.log(data);
		const pdf = await PDFJS.getDocument(data);
		const canvas = document.createElement("canvas");
		for (let i = 0; i < pdf.numPages; i++) {
			const page = await pdf.getPage(i + 1);
			const viewport = page.getViewport({ scale: 1 });
			const context = canvas.getContext("2d");
			canvas.height = viewport.height;
			canvas.width = viewport.width;
			await page.render({ canvasContext: context, viewport: viewport })
				.promise;
			images.append(canvas.toDataURL());
		}
		canvas.remove();
		return images;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const images = convertPdfToImages(docFile[0]);
		console.log(images);
		// TODO: add qr code to that pdf file
		const token = uuidv4();
		const qrCode = await QRCode.toCanvas(
			`http://localhost:3000/verify/${token}`
		);
		console.log(qrCode);
		const imgData = qrCode.toDataURL("image/png");
		const pdf = new jsPDF();
		pdf.addImage(imgData, "JPEG", 0, 0);
		// pdf.output('dataurlnewwindow');
		pdf.save("download.pdf");

		return;

		const cid = await uploadFilesToIPFS(docFile);
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

	const issueDocuments = async (e) => {
		e.preventDefault();
		var canvases = document.getElementsByClassName("templateCanvas");
		console.log(canvases);

		var cids = [];
		var fileNames = [];
		Array.from(canvases).forEach(async (canvas) => {
			var url = canvas.toDataURL("image/png");
			const pdf = new jsPDF("p", "mm", [157.1625, 111.125]);
			pdf.addImage(url, "JPEG", 0, 0);

			fileNames.push("Marksheet.pdf");

			const files = [new File([pdf.output("blob")], "Marksheet.pdf")];

			const cid = await uploadFilesToIPFS(files);
			console.log(cid);
			cids.push(cid);
			// var link = document.createElement("a");
			// link.download = "filename.png";
			// link.href = url;
			// link.click();
		});
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
					Issue Marksheet
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
									Generating mark sheets for{" "}
									{bulkEntries.length} students
								</span>
								<button onClick={downloadCanvasImage}>
									Download
								</button>
								<button onClick={issueDocuments}>
									Issue documents
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
								Select Mark Sheet PDF
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
						<button
							className={styles.issueDocBtn}
							onClick={handleSubmit}
						>
							<TaskAltIcon className={styles.tickIcon} /> Issue
						</button>
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

export default MarkSheetUploadPage;
