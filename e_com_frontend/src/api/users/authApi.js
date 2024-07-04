import axiosInstance from "../../utils/axiosInstance";

export const signUpUser = async (formData) => {
	try {
		const response = await axiosInstance.post("users/signup", formData);
		return response;
	} catch (error) {
		//this 'error' will be passed to the catch() block inside the handleSubmit() signUp functions where signUpUser() is being called from

		console.log(error)
		throw error;
	}
};


export const signInUser = async (formData) => {
	try {
		const response = await axiosInstance.post('users/signin', formData)
		return response
		
	} catch (error) {
		console.log(error)
		throw error
	}

}
