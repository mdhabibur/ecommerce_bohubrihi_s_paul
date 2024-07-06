import axiosInstance from "../../utils/axiosInstance";

export const initPayment = async (token) => {
	try {
		const response = await axiosInstance.get("/payment/", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
        return response

	} catch (error) {
        throw error
    }
};
