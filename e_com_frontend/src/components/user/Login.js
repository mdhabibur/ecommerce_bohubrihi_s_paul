import React, { useEffect, useState } from "react";
import {Navigate} from 'react-router-dom'
import Layout from "../Layout";
import { showError, showLoading, showSuccess } from "../../utils/responseMessages";
import { signInUser } from "../../api/users/authApi";
import { authenticate, isAuthenticated, userInfo } from "../../utils/auth";

const Login = () => {

	const [formData, setFormData] = useState({
		email: '',
		password: ''

	})

	const [error, setError] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [loading, setLoading] = useState(false);
	const [redirect, setRedirect] = useState(false)


	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value

		})
	}

	const {email, password} = formData
	console.log("email: ", email)


	const handleSubmit = async (e) => {
		e.preventDefault()

		//3 states of api call
		//1. loading state/initial state
		setLoading(true)
		setError(false)
		setSuccess(false)

		try {

		  const response = await signInUser(formData)
		  console.log(response)

		  authenticate(response.data.token, () => {

			//2. success state
			setLoading(false)
			setError(false)
			setSuccess(true)
			setRedirect(true)
			setSuccessMsg(response?.data?.message || "user login successful")

		  })

			
		} catch (error) {

			//3. rejected state
			setLoading(false)
			setError(true)
			setSuccess(false)
			setErrorMsg(error.response?.data?.message || "user login failed")
			setRedirect(false)
			console.log(error)
			
		}


	}


	//show messages for 3 seconds
	useEffect( () => {
		if(error || success || loading){
			const timer = setTimeout(() => {

				if(loading){
                    alert("timeout for login")
                }

				setLoading(false)
				setError(false)
				setSuccess(false)
			}, 5000);

			return () => clearTimeout(timer)
		}


	}, [loading, error, success])


	const signInForm = () => (
		<form onSubmit={handleSubmit}>

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
				Login
			</button>
		</form>
	);


	const redirectUser = () => {

		if(isAuthenticated()){
			if(userInfo().role === 'admin'){
				return <Navigate to="/admin/dashboard" />
			}
			if(userInfo().role === 'user'){
				return <Navigate to="/user/dashboard" />
			}
		}

	}


	return (
		<Layout title='Login' offsetMd3="offset-md-3" className='container'>

			{loading && showLoading(loading)}
			{error && showError(error, errorMsg)}
			{success && showSuccess(success, successMsg)}
			{redirect && redirectUser()}


			<h3>Login Here</h3>
			<hr/>

			{
				signInForm()
			}

			<hr/>

		</Layout>
	);
};

export default Login;
