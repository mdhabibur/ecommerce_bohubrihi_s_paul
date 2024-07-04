import axiosInstance from "../../utils/axiosInstance";

export const createProduct = async (token, formData) => {
    try{
        const response = await axiosInstance.post("/product/", formData, {
            headers: {
                'Authorization' : `bearer ${token}`,
                'Content-Type': 'multipart/form-data'
                
            }
        })
        return response
    }catch(error){
        throw error
    }
}

export const getProducts = async (sortBy, order, limit) => {

    //http://localhost:3001/api/product/?sortBy=price&order=desc&limit=3

    try {
        const response = axiosInstance.get(`/product/?sortBy=${sortBy}&order=${order}&limit=${limit}`)
        return response
        
    } catch (error) {
        throw error
        
    }

}


export const getProductDetails = async (id) => {
    try {
        const response = await axiosInstance.get(`/product/${id}`)
        return response
        
    } catch (error) {
        throw error
        
    }

}


export const filterProducts = async (filterObj) => {
    try {
        const response = await axiosInstance.post('/product/filter/', filterObj)
        return response
        
    } catch (error) {
        throw error
    }

}






export const getCategories = async () => {
	try {
		const response = await axiosInstance.get("/category/");
		return response;
	} catch (error) {
		throw error;
	}
};
