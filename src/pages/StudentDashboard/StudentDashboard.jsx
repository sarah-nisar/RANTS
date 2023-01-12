import React from "react";
import styles from "./StudentDashboard.module.css";
import styles2 from "../Register/Register.module.css";
import { useNavigate } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";
import { Description } from "@ethersproject/properties";

const StudentDashboard = () => {
	const navigate = useNavigate();

	const [name, setName] = useState("Atharva");
	const [sid, setSid] = useState("191070053");
	const [email, setEmail] = useState("appatil_b19@ce.vjti.ac.in");
	const [docDetails, setDocDetails] = useState("10th Marksheet Certificate");
	const [reqType, setreqType] = useState("Create");
	const [department, setdepartment] = useState("");
	const [docName, setdocName] = useState("");

	const {
		registerStudent,
		getStudent,
		fetchAllDocumentsForStudent,
		requestDocument,
	} = useCVPContext();
	const { checkIfWalletConnected, currentAccount } = useAuth();

	useEffect(() => {
		checkIfWalletConnected();
	}, []);

	const fetchStudent = useCallback(async () => {
		try {
			const student = await getStudent();
			if (student) {
				navigate("/dashboard");
				console.log(student);
			}
		} catch (err) {
			console.log(err);
		}
	});

	const FetchAllDocumentsForStudent = useCallback(async () => {
		try {
			const documents = await fetchAllDocumentsForStudent();
			if (documents) {
				console.log(documents);
			}
		} catch (err) {
			console.log(err);
		}
	});

	useEffect(() => {
		fetchStudent();
		FetchAllDocumentsForStudent();
	}, [currentAccount]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(docName, docDetails, department);
		if (docName === "" || department === "" || docDetails === "") {
			alert("Enter all details first");
			return;
		}

		try {
			await requestDocument(
				currentAccount,
				docName,
				docDetails,
				reqType,
				department
			);
		} catch (err) {
			console.log(err);
			return;
		}
	};

	return (
		<>
			<div className={styles.dashboardBox}>
				<div className={styles.heading}>
					Welcome <span className={styles.name}>{name}</span>
				</div>
				<div className={styles.detailsBox}>
					<span className={styles.detailsHeading}>My details</span>
					<div className={styles.details}>
						Public Address:{" "}
						<span className={styles.name}>{currentAccount}</span>
					</div>
					<div className={styles.details}>
						Registration ID:{" "}
						<span className={styles.name}>{sid}</span>
					</div>
					<div className={styles.details}>
						VJTI Email ID:{" "}
						<span className={styles.name}>{email}</span>
					</div>
				</div>
				<div className={styles.detailsBox}>
					<span className={styles.detailsHeading}>My Documents</span>
					<div className={styles.details}>
						Public Address:{" "}
						<span className={styles.name}>{currentAccount}</span>
					</div>
					<div className={styles.details}>
						Registration ID:{" "}
						<span className={styles.name}>{sid}</span>
					</div>
					<div className={styles.details}>
						VJTI Email ID:{" "}
						<span className={styles.name}>{email}</span>
					</div>
				</div>
				<div className={styles.detailsBox}>
					<span className={styles.detailsHeading}>
						Request a document
					</span>
					<form
						onSubmit={handleSubmit}
						className={`${styles.formBox}`}
					>
						<div className={`${styles2.inputContainer}`}>
							<label className={`${styles2.inputLabel}`}>
								Document type
							</label>
							<select
								className={`${styles2.input}`}
								onChange={(e) => setdocName(e.target.value)}
							>
								<option>Marksheet</option>
								<option>Transcripts</option>
								<option>Leaving Certificate</option>
							</select>
						</div>

						<div className={`${styles2.inputContainer}`}>
							<label className={`${styles2.inputLabel}`}>
								Department
							</label>
							<select
								className={`${styles2.input}`}
								onChange={(e) => setdepartment(e.target.value)}
							>
								<option>Academic Section</option>
								<option>Examination Section</option>
								<option>Scholarship Section</option>
							</select>
						</div>

						<div className={`${styles2.inputContainer}`}>
							<label className={`${styles2.inputLabel}`}>
								Document details
							</label>
							<input
								className={`${styles2.input}`}
								type="textarea"
								placeholder="Enter document details"
								onChange={(e) => setDocDetails(e.target.value)}
								value={docDetails}
							/>
						</div>
					</form>
				</div>
				<button
					className={styles.requestFileBtn}
					onClick={handleSubmit}
				>
					Request File
				</button>
			</div>
		</>
	);
};

export default StudentDashboard;
