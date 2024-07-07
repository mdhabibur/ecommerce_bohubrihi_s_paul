import React, { useEffect, useState } from "react";
import { initPayment } from "../../api/users/paymentApi";
import { userInfo } from "../../utils/auth";
import { Link } from "react-router-dom";
import { showError } from "../../utils/responseMessages";

const PaymentPage = () => {
	const [sessionSuccess, setSessionSuccess] = useState(false);
	const [sessionFailed, setSessionFailed] = useState(false);
	const [redirectGatewayURL, setRedirectGatewayURL] = useState("");

	useEffect(() => {
		initPayment(userInfo().token)
			.then((response) => {
				console.log(response.data);
				if (response.data.response.status === "SUCCESS") {
					console.log(response.data.response.status);
					// setSessionSuccess(true);
					setRedirectGatewayURL(response.data.response.GatewayPageURL);
				}
			})
			.catch((error) => {
				setSessionFailed(true);
			});
	}, []);

	return (
		<>
			{sessionSuccess ? (
				<>
					<div className="container text-center"><h5>payment is processing</h5></div>
					{(window.location = redirectGatewayURL)}{" "}
				</>
			) : (
				""
			)}

			{sessionFailed ? (
				<div className="container">
					{showError(true, "Payment Failed")}
					<button className="btn btn-warning">
                    <Link to="/user/cart">Go Back</Link>
                    </button>
				</div>
			) : (
				""
			)}
		</>
	);
};

export default PaymentPage;
