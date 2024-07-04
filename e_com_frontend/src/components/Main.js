import { Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Login from "./user/Login";
import Register from "./user/Register";
import NotFoundRoute from "./NotFoundRoute";
import Dashboard from "./user/Dashboard";
import PrivateRoute from "./protectedRoutes/PrivateRoute";
import AdminRoute from "./protectedRoutes/AdminRoute";
import AdminDashboard from "./admin/AdminDashboard";
import PublicRoute from "./protectedRoutes/PublicRoute";
import CreateCategory from "./admin/CreateCategory";
import CreateProduct from "./admin/CreateProduct";
import ProductDetails from "./home/ProductDetails";
import Cart from "./orders/Cart";
import ShippingDetails from "./orders/ShippingDetails";
import CheckoutPage from "./orders/CheckoutPage";
import UserProfile from "./user/UserProfile";

const Main = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />

			<Route
				path="/login"
				element={
					<PublicRoute>
						<Login />
					</PublicRoute>
				}
			/>
			<Route
				path="/register"
				element={
					<PublicRoute>
						<Register />
					</PublicRoute>
				}
			/>

			<Route
				path="/user/dashboard"
				element={
					<PrivateRoute>
						<Dashboard />
					</PrivateRoute>
				}
			/>

			<Route
				path="/user/profile"
				element={
					<PrivateRoute>
						<UserProfile />
					</PrivateRoute>
				}
			/>

			<Route
				path="/user/cart"
				element={
					<PrivateRoute>
						<Cart />
					</PrivateRoute>
				}
			/>

			<Route
				path="/user/shipping"
				element={
					<PrivateRoute>
						<ShippingDetails />
					</PrivateRoute>
				}
			/>

			<Route
				path="/user/checkout"
				element={
					<PrivateRoute>
						<CheckoutPage />
					</PrivateRoute>
				}
			/>

			<Route
				path="/admin/dashboard"
				element={
					<AdminRoute>
						<AdminDashboard />
					</AdminRoute>
				}
			/>

			<Route
				path="/create/category"
				element={
					<AdminRoute>
						<CreateCategory />
					</AdminRoute>
				}
			/>

			<Route
				path="/create/product"
				element={
					<AdminRoute>
						<CreateProduct />
					</AdminRoute>
				}
			/>

			<Route path="/product/:productId" element={<ProductDetails />} />

			<Route path="*" element={<NotFoundRoute />} />
		</Routes>
	);
};

export default Main;
