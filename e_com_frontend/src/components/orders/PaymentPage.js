import React, { useEffect, useState } from "react";
import { initPayment } from "../../api/users/paymentApi";
import { userInfo } from "../../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import { showError } from "../../utils/responseMessages";

const PaymentPage = () => {
	const [sessionSuccess, setSessionSuccess] = useState(false);
	const [sessionFailed, setSessionFailed] = useState(false);
	const [redirectGatewayURL, setRedirectGatewayURL] = useState("");

	const navigate = useNavigate()

	useEffect(() => {
		initPayment(userInfo().token)
			.then((response) => {
				console.log(response.data);
				if (response.data.response.status === "SUCCESS") {
					console.log(response.data.response.status);
					setSessionSuccess(true);
					setRedirectGatewayURL(response.data.response.GatewayPageURL);
				}else {
					//if response status is 'failed' or 'canceled'
					setSessionFailed(true);

					setTimeout(() => {
						navigate('/')
					}, 3000);
				}
			})
			.catch((error) => {
				console.log("payment session error: ", error)
				setSessionFailed(true);
			});
	}, []);

	return (
		<>
			{sessionSuccess ? (
				<>
					<div className="container text-center alert alert-info"><h5>payment is processing</h5></div>
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
