const { Navigate } = require("react-router-dom")
const { userInfo } = require("../../utils/auth")


const AdminRoute = ({children}) => {
    const user = userInfo()

    if(user && user.role === 'admin'){
        return children

    }else {
        return <Navigate to = '/' />
    }


}

export default AdminRoute