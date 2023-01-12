import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";
import { useCVPContext } from "../../Context/CVPContext";
import { useAuth } from "../../Context/AuthContext";

const Admin = () => {
	const { getStaffMember } = useCVPContext();
	const { checkIfWalletConnected, currentAccount } = useAuth();

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

	const navigate = useNavigate();

	const navigateToMarksheetUpload = () => {
		navigate("/issueMarksheet");
	};

	return (
		<div className={styles.homePageContainer}>
			<div className={styles.homePageBodyContainer}>
				<span className={styles.adminDashboardHeader}>
					Admin Dashboard
				</span>
				<div>
					<span>
						{user.name}
						<br />
						{user.department}
						<br />
						{user.emailId}
						<br />
						{user.staffAdd}
						<br />
						{/* {user.map((item) => {
							console.log(user);
							return item;
						})} */}
					</span>
				</div>
				<div className={styles.homePageSection}>
					<span className={styles.issueDocSubHeader}>
						Issue Documents
					</span>
					<div className={styles.issueDocGrid}>
						<div
							className={styles.issueDocCard}
							onClick={navigateToMarksheetUpload}
						>
							Mark Sheets
						</div>
						<div className={styles.issueDocCard}>Transcripts</div>
						<div className={styles.issueDocCard}>
							Leaving Certificate
						</div>
					</div>
				</div>

				<div className={styles.homePageSection}>
					<span className={styles.issueDocSubHeader}>
						Quick Actions
					</span>
					<div className={styles.issueDocGrid}>
						<div className={styles.issueDocCard}>
							View Student Docs
						</div>
						<div className={styles.issueDocCard}>View Requests</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Admin;
