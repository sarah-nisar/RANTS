import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useCVPContext } from "../../Context/CVPContext";
import styles from "./Requests.module.css";

const Requests = () => {
	const { getStaffMember, fetchAllRequestsForCollegeStaff } = useCVPContext();
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

	const fetchPendingRequests = useCallback(async () => {
		try {
			console.log("Hello");
			const data = await fetchAllRequestsForCollegeStaff();
			console.log("Requests:", data);
			var result = [];
			for (let i = 0; i < data.length; i++) {
				if (data[i].status.toNumber() === 1) result.push(data[i]);
			}
			setPendingdescription(result);
		} catch (err) {
			console.log(err);
		}
	});

	useEffect(() => {
		console.log(currentAccount);
		if (currentAccount !== "") {
			fetchStudent();
			fetchPendingRequests();
		}
	}, [currentAccount]);

	const navigate = useNavigate();

	const [pendingdescription, setPendingdescription] = useState([
		{
			sid: "191070053",
			studentAdd: "appatil_b19@ce.vjti.ac.in",
			docName: "Marksheet",
			department: "Academic",
			description: "Sem 1 Marksheet",
		},
		{
			sid: "191070078",
			studentAdd: "abjaiswal_b19@ce.vjti.ac.in",
			docName: "Leaving Certificate",
			department: "Academic",
			description: "12th Leaving Certificate",
		},
	]);
	return (
		<div>
			<div className={styles.detailsBox}>
				<span className={styles.heading}>All Documents Requests</span>
				<table className={`table-auto ${styles.table} `}>
					<thead>
						<tr className={styles.tableRow}>
							<th>Student ID</th>
							<th>Student Address</th>
							<th>Document Name</th>
							<th>Department</th>
							<th>Document Description</th>
						</tr>
					</thead>
					<tbody>
						{pendingdescription.map((value, index) => {
							return (
								<tr className={styles.tableRow} key={index}>
									<td>{value.sid}</td>
									<td>{value.studentAdd}</td>
									<td>{value.docName}</td>
									<td>{value.department}</td>
									<td>{value.description}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Requests;
