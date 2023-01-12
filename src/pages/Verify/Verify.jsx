import React, { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useCVPContext } from "../../Context/CVPContext";
import styles from "./Verify.module.css";
import { Jwt } from "jsonwebtoken";
import { useJwt, decodeToken } from "react-jwt";

const Verify = () => {
	const token = window.location.pathname.split("/")[2];
	const [document, setDocument] = useState([]);

	const { verifyDocument } = useCVPContext();
	const { checkIfWalletConnected, currentAccount } = useAuth();
	const [cid, setCID] = useState("");

	useEffect(() => {
		checkIfWalletConnected();
	}, []);

	useEffect(() => {
		if (currentAccount === "") checkIfWalletConnected();
	}, [currentAccount]);

	const verify = async () => {
		try {
			console.log("Hello");
			const data = await verifyDocument(token);
			setDocument(data);
			// TODO: Decode using jwt
			setCID(cid);
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<div>
			<button onClick={verify}>Verify document</button>
			{document && document.length !== 0 && (
				<div>
					Document
					<span>document.docName</span>
					<span>document.description</span>
					<span>document.studentAdd</span>
					<span>document.issuer2</span>
					<span>document.department</span>
					<a href={`https://${cid.cid}.ipfs.w3s.link/${cid.docName}`}>
						Open Document
					</a>
				</div>
			)}
		</div>
	);
};

export default Verify;
