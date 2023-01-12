import React, { useCallback, useEffect, useState } from "react";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";

const Register = () => {
	const navigate = useNavigate();

	const [pubAddr, setPubAddr] = useState("");
	const [sid, setSid] = useState("");
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [mobileNo, setMobileNo] = useState("");

	const { registerStudent, getStudent } = useCVPContext();
	const { checkIfWalletConnected, currentAccount } = useAuth();

	useEffect(() => {
		checkIfWalletConnected();
	}, []);

	const fetchStudent = useCallback(async () => {
		try {
			const student = await getStudent();
			if (student) {
				navigate("/dashboard");
			}
		} catch (err) {
			// console.log(err);
		}
	});

	useEffect(() => {
		fetchStudent();
		setPubAddr(currentAccount);
	}, [currentAccount]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			pubAddr === "" ||
			sid === "" ||
			email === "" ||
			name === "" ||
			mobileNo === ""
		) {
			alert("Enter all details first");
			return;
		}

		try {
			await registerStudent(name, email, pubAddr, mobileNo, sid);
			navigate("/dashboard");
		} catch (err) {
			console.log(err);
			return;
		}
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
						readOnly
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

				<a
					className={`${styles.registerBtn}`}
					onClick={handleSubmit}
					href="/"
				>
					<span className="ml-4">Register</span>
				</a>
			</form>
		</div>
	);
};

export default Register;
