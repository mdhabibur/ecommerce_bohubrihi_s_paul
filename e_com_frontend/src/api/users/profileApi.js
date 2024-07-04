import axiosInstance from "../../utils/axiosInstance"


export const setProfile = async (token, userProfile) => {
    try {
        const response = await axiosInstance.post('/profile/', userProfile, {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        })

        return response
        
    } catch (error) {
        throw error
        
    }

}

export const getProfile = async (token) => {
    try {
        const response = axiosInstance.get('/profile/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response
        
    } catch (error) {
        throw error
        
    }
}