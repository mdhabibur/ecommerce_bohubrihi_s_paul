import {jwtDecode} from 'jwt-decode';

export const authenticate = (token, cb) => {
    if(typeof window !== 'undefined'){
        localStorage.setItem('jwt', token)
        cb()
    }
}

export const isAuthenticated = () => {
    if(typeof window === 'undefined') return false

    const token = localStorage.getItem('jwt')

    if(token){

        try {
        //also check if expired or not
        const decodedToken = jwtDecode(token)
        // console.log("decoded token:", decodedToken)

        const {exp} = decodedToken
        const currentTime = Date.now() / 1000 //in seconds
        const isExpired = currentTime > exp

        console.log("isExpired: ", isExpired)

        if(isExpired){
            localStorage.removeItem('jwt')
            return false
        } else {
            return true
        }
            
        } catch (error) {
            return false 
            //invalid token or some other errors
            
        }

    }else {
        return false
    }

}


export const userInfo = () => {
    if(typeof window !== 'undefined'){
       const token = localStorage.getItem('jwt')
       if(token){
        const user = jwtDecode(token)
        return {...user, token: token}
       }else {
        return null
       }

    }
}

export const signOut = (cb) => {
    if(typeof window !== 'undefined'){
        localStorage.removeItem('jwt')
        cb()
    }
}