import React, { useCallback, useEffect, useState } from "react";
import styles from "./RegisterStaff.module.css";
import { useNavigate } from "react-router-dom";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const RegisterStaff = () => {
	const navigate = useNavigate();

	const [pubAddr, setPubAddr] = useState("");
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
    const [department, setDepartment] = useState("");

	const { registerStudent, getStudent, RegisterStaff } = useCVPContext();
	const { checkIfWalletConnected, currentAccount } = useAuth();

	// useEffect(() => {
	// 	checkIfWalletConnected();
	// }, []);

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
		// fetchStudent();
		setPubAddr(currentAccount);
	}, [currentAccount]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			pubAddr === "" ||
			email === "" ||
			name === "" ||
			department === ""
		) {
			alert("Enter all details first");
			return;
		}

		try {
            await RegisterStaff(name, email, department, 2);
			// await registerStudent(name, email, pubAddr, mobileNo, sid);
			navigate("/admin");
		} catch (err) {
			console.log(err);
			return;
		}
	};

    const handleDepartmentTypeChange = (e) => {
        setDepartment(e.target.value);
    }

	return (
		<div className={styles.registerPageContainer}>
			<form onSubmit={handleSubmit} className={`${styles.formBox}`}>
				<h2 className={`${styles.heading}`}>Register Staff</h2>

				<div className={`${styles.inputContainer}`}>
					<label className={`${styles.inputLabel}`}>
						Staff Public Address
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
					<label className={`${styles.inputLabel}`}>Department</label>
					<select
                        className={`${styles.input}`}
                        onChange={handleDepartmentTypeChange}
                    >
                        <option>Exam Dept</option>
                        <option>Academics</option>
                    </select>
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

                <button onClick={handleSubmit} className={styles.registerBtn}>
                    Register
                    <ArrowForwardIcon className={styles.arrowForwardIcon}/>
                </button>
			</form>
		</div>
	);
};

export default RegisterStaff;
