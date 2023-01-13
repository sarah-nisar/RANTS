import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useCVPContext } from "../../Context/CVPContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "./ViewStudentDocs.module.css";

const ViewStudentDocs = () => {
	const [documents, setDocuments] = useState([]);
	const [emailId, setemailId] = useState("");
	const [isOwner, setIsOwner] = useState(false);

	const {
		fetchAllDocumentsForStudentByAdmin,
		fetchAllDocumentsForStudentByStaff,
	} = useCVPContext();

	const { checkIfWalletConnected, currentAccount } = useAuth();

	const openDocPage = (ipfsCID, docName) => {
		const win = window.open(`https://${ipfsCID}.ipfs.w3s.link/${docName}`);
		win.focus();
	};

	useEffect(() => {
		checkIfWalletConnected();
	}, []);

	const navigate = useNavigate();

	const { getStaffMember, isOwnerAddress } = useCVPContext();
	const [user, setUser] = useState([]);

	const fetchStudent = useCallback(async () => {
		try {
			const staffMember = await getStaffMember();
			const owner = await isOwnerAddress();
			console.log(owner);
			setIsOwner(owner);
			setUser(staffMember);
		} catch (err) {
			console.log(err);
			navigate("/register");
		}
	});

	useEffect(() => {
		console.log(currentAccount);
		if (currentAccount !== "") fetchStudent();
	}, [currentAccount]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("emailId", emailId);
		if (emailId === "") {
			alert("Enter all details first");
			return;
		}

		try {
			if (isOwner) {
				const data = await fetchAllDocumentsForStudentByAdmin(emailId);
				setDocuments(data);
			} else {
				const data = await fetchAllDocumentsForStudentByStaff(emailId);
				setDocuments(data);
			}
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<>
			<div>
				<form className={`${styles.formBox}`}>
					<div className={`${styles.inputContainer}`}>
						<label className={`${styles.inputLabel}`}>
							Email Id
						</label>
						<input
							className={`${styles.input}`}
							type="text"
							placeholder="Enter Student's Email ID"
							onChange={(e) => setemailId(e.target.value)}
							value={emailId}
						/>
					</div>
					<button
						className={styles.requestDocBtn}
						onClick={handleSubmit}
					>
						Request Documents
						<ArrowForwardIcon className={styles.arrowForwardIcon} />
					</button>
				</form>
				{/* {documents.length !== 0 ? ( */}
				<div className={styles.detailsBox}>
					<span className={styles.detailsHeading}>My Documents</span>
					{documents.map((item, index) => {
						return (
							<div
								className={styles.docCard}
								onClick={() => {
									openDocPage(item.ipfsCID, item.docName);
								}}
							>
								<span>Document Name: {item.docName}</span>
								<span>Description: {item.description}</span>
								<span>Department: {item.department}</span>
							</div>
						);
					})}
				</div>
				{/* ) : null} */}
			</div>
		</>
	);
};
export default ViewStudentDocs;
