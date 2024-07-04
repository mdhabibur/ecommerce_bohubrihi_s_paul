import axiosInstance from "../../utils/axiosInstance";

export const createCategory = async (token, formData) => {
	try {
		const response = await axiosInstance.post("/category/", formData, {
			headers: {
				Authorization: `bearer ${token}`,
			},
		});

		return response;
	} catch (error) {
		throw error;
	}
};

export const getCategories = async () => {
	try {
		const response = await axiosInstance.get("/category/");
		return response;
	} catch (error) {
		throw error;
	}
};
