import React, { useCallback, useEffect, useState } from "react";
import styles from "./RegisterStaff.module.css";
import { useNavigate } from "react-router-dom";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const RegisterStaff = () => {
	const navigate = useNavigate();

	const [pubAddr, setPubAddr] = useState("");
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [department, setDepartment] = useState("Exam Section");

	const { getStaffMember, isOwnerAddress, registerStaff } = useCVPContext();
	const { checkIfWalletConnected, currentAccount } = useAuth();

	useEffect(() => {
		checkIfWalletConnected();
	}, []);
	const [user, setUser] = useState([]);
	const [isOwner, setIsOwner] = useState(false);

	const fetchStudent = useCallback(async () => {
		try {
			const staffMember = await getStaffMember();
			console.log(staffMember);
			const owner = await isOwnerAddress();
			setIsOwner(owner);
			setUser(staffMember);
			if (!owner && staffMember.department !== "Academic Section") {
				navigate("/admin");
			}
		} catch (err) {
			console.log(err);
			navigate("/register");
		}
	});

	useEffect(() => {
		if (currentAccount !== "") fetchStudent();
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
			console.log(pubAddr, name, department, email, 2);
			await registerStaff(pubAddr, name, department, email, 2);
			navigate("/admin");
		} catch (err) {
			console.log(err);
			return;
		}
	};

	const handleDepartmentTypeChange = (e) => {
		setDepartment(e.target.value);
	};

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
						value={department}
					>
						<option value={"Academic Section"}>
							Academic Section
						</option>
						<option value={"Exam Section"}>Exam Section</option>
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
					<ArrowForwardIcon className={styles.arrowForwardIcon} />
				</button>
			</form>
		</div>
	);
};

export default RegisterStaff;
