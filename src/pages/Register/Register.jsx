import React, { useCallback, useEffect, useState } from "react";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";

const Register = () => {
	const navigate = useNavigate();

	const { registerStudent, getStudent } = useCVPContext();

	const [pubAddr, setPubAddr] = useState("");
	const [sid, setSid] = useState("");
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [mobileNo, setMobileNo] = useState("");

	const { checkIfWalletConnected, currentAccount } = useAuth();

	useEffect(() => {
		checkIfWalletConnected();
	}, []);

	const fetchStudent = useCallback(async () => {
		try {
			const student = await getStudent();
			if (student) {
				navigate("/");
			}
		} catch (err) {
			console.log(err);
		}
	});

	useEffect(() => {
		fetchStudent();
	}, [currentAccount]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (pubAddr === "" || sid === "" || email === "") {
			alert("Enter all details first");
			return;
		}

		try {
			await registerStudent("ANkit", email, pubAddr, "7977005251", sid);
			navigate("/");
		} catch (err) {
			console.log(err);
			return;
		}
	};

	const navigateToMarksheetUpload = () => {
		navigate("/issueMarksheet");
	};

	return (
		<div className={styles.registerPageContainer}>
			<form onSubmit={handleSubmit} className={`${styles.formBox}`}>
				<h2 className={`${styles.heading}`}>Register</h2>

				<div className={`${styles.inputContainer}`}>
					<label className={`${styles.inputLabel}`}>
						Public Address
					</label>
					<input
						className={`${styles.input}`}
						type="text"
						placeholder="Enter public address"
						onChange={(e) => setPubAddr(e.target.value)}
						value={pubAddr}
					/>
				</div>
				<div className={`${styles.inputContainer}`}>
					<label className={`${styles.inputLabel}`}>Name</label>
					<input
						className={`${styles.input}`}
						type="text"
						placeholder="Enter your name"
						onChange={(e) => setName(e.target.value)}
						value={name}
					/>
				</div>

				<div className={`${styles.inputContainer}`}>
					<label className={`${styles.inputLabel}`}>Student ID</label>
					<input
						className={`${styles.input}`}
						type="text"
						placeholder="Enter your VJTI Registration ID"
						onChange={(e) => setSid(e.target.value)}
						value={sid}
					/>
				</div>

				<div className={`${styles.inputContainer}`}>
					<label className={`${styles.inputLabel}`}>Mobile No</label>
					<input
						className={`${styles.input}`}
						type="text"
						placeholder="Enter your mobile number"
						onChange={(e) => setMobileNo(e.target.value)}
						value={mobileNo}
					/>
				</div>

				<div className={`${styles.inputContainer}`}>
					<label className={`${styles.inputLabel}`}>
						VJTI Email ID
					</label>
					<input
						className={`${styles.input}`}
						type="text"
						placeholder="Enter your VJTI Email ID"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
				</div>

				<div className={`${styles.registerBtn}`}>
					<a
						className={`${styles.anchorTag}`}
						onClick={handleSubmit}
						href="/"
					>
						<span className="ml-4">Register</span>
					</a>
				</div>
			</form>
		</div>
	);
};

export default Register;
