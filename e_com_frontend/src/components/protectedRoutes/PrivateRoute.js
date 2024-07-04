import { userInfo } from "../../utils/auth";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const user = userInfo();

	if (user) {
		return children;
	} else {
		return <Navigate to="/login" />;
	}
};

export default PrivateRoute;
