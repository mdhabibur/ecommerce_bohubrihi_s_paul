import axiosInstance from "../../utils/axiosInstance"


export const addToCart = async (token, cartItem) => {
    try {
        const response = await axiosInstance.post('/cart/', cartItem, {
            headers: {
                "Authorization" : `bearer ${token}`
            }
        })
        return response
    } catch (error) {
        throw error
    }
}


export const getCartItems = async (token) => {
    try {
        const response = await axiosInstance.get('/cart/', {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
        return response
        
    } catch (error) {
        throw error
        
    }

}

export const updateCartItem = async (token, updatedCartItem) => {
    try {
        const response = await axiosInstance.put('/cart/', updatedCartItem, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })

        return response
        
    } catch (error) {
        throw error
        
    }
}

export const deleteCartItem = async (token, cartItemId) => {
    try {
        const response = await axiosInstance.delete(`/cart/${cartItemId}`, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
        return response
        
    } catch (error) {
        throw error
        
    }

}