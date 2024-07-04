import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { signUpUser } from "../../api/users/authApi";
import {
	showError,
	showLoading,
	showSuccess,
} from "../../utils/responseMessages";
import { useNavigate } from "react-router-dom";

const Register = () => {

	const navigate = useNavigate()

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	const [error, setError] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [loading, setLoading] = useState(false);

	const { name, email, password } = formData;



	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(false);

		try {
			const response = await signUpUser(formData);
			setLoading(false);
			setError(false);
			setSuccess(true);
			setSuccessMsg(response.data.message || "new user registration successful");

			console.log("response: ", response);

			setTimeout(() => {
				navigate('/login')
			}, 2000)

		} catch (error) {

			console.log("error: ", error.response?.data?.message)

			setLoading(false);
			setError(true);
			setErrorMsg(error.response?.data?.message || "something went wrong");
		}
	};

	//show messages for 3 seconds
	useEffect( () => {
		if(error || success || loading){
			const timer = setTimeout(() => {

				if(loading){
                    alert("timeout for account creation")
                }
				
				setLoading(false)
				setError(false)
				setSuccess(false)
			}, 5000);

			return () => clearTimeout(timer)
		}


	}, [loading, error, success])

	const signUpForm = () => (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<label className="text-muted">Name:</label>
				<input
					type="text"
					name="name"
					className="form-control"
					value={name}
					onChange={handleChange}
				/>
			</div>
			<div className="form-group">
				<label className="text-muted">Email:</label>
				<input
					type="email"
					name="email"
					className="form-control"
					value={email}
					onChange={handleChange}
				/>
			</div>
			<div className="form-group">
				<label className="text-muted">Password:</label>
				<input
					type="password"
					name="password"
					className="form-control"
					value={password}
					onChange={handleChange}
				/>
			</div>
			<button type="submit" className="btn btn-primary" disabled={loading}>
				Create Account
			</button>
		</form>
	);

	return (
		<Layout title="Register" className="container" offsetMd3="offset-md-3">

			{loading && showLoading(loading)}
			{error && showError(error, errorMsg)}
			{success && showSuccess(success, successMsg)}

			<h3>Register Here</h3>
			<hr />
			{signUpForm()}
			<hr />
		</Layout>
	);
};

export default Register;
