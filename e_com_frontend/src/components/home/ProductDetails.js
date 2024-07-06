import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { Link, useParams } from "react-router-dom";
import { getProductDetails } from "../../api/admin/productApi";
import { API } from "../../utils/config";
import { showError, showGeneralMessage, showLoading, showSuccess } from "../../utils/responseMessages";
import { isAuthenticated, userInfo } from "../../utils/auth";
import { addToCart } from "../../api/users/cartApi";

const ProductDetails = () => {
	const { productId } = useParams();
	const [product, setProduct] = useState({});

    const [error, setError] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [loading, setLoading] = useState(false);

	// for cart 
	const [authenticatedAlertBeforeAddToCart, setAuthenticatedAlertBeforeAddToCart] = useState(false)
	const [cartErrorMsg, setCartErrorMsg] = useState("")
	const [cartSuccessMsg, setCartSuccessMsg] = useState("")

	useEffect(() => {
        setLoading(true)

		try {
			const response = getProductDetails(productId)
				.then((response) => {
					setProduct(response.data.product);
					console.log(response.data);

                    //2. success state
					setLoading(false)
					setError(false)
					setSuccess(true)
					setSuccessMsg("Product Details")

				})
				.catch((error) => {
					console.log(error);

                    //3. rejected state
					setLoading(false)
					setError(true)
					setSuccess(false)
					setErrorMsg(error.response?.data?.message || "fetching product failed")
					console.log(error)
				});
		} catch (error) {
			console.log(error);
		}
	}, []);

	const { _id, name, description, price, quantity } = product;

	console.log("product: ", product);


    
	useEffect( () => {

		if(loading || error || success){

			const timer = setTimeout( () => {
				if(loading){
					alert("time out to fetch product")
				}
				setLoading(false)
				setError(false)
				setSuccess(false)

			}, 5000)

			return () => clearTimeout(timer)

		}

		if(authenticatedAlertBeforeAddToCart || cartErrorMsg || cartSuccessMsg){

			const timer = setTimeout( () => {
				setAuthenticatedAlertBeforeAddToCart(false)
				setCartErrorMsg("")
				setCartSuccessMsg("")

			}, 5000)

			return () => clearTimeout(timer)

		}

	}, [loading, error, success, authenticatedAlertBeforeAddToCart, cartErrorMsg, cartSuccessMsg])


		//add to cart 
		const handleAddToCart = (productId, productPrice) => {

			if(isAuthenticated()){
	
			const {token} = userInfo()
	
			 const cartItem = {
					user: userInfo()._id,
					product: productId,
					price: productPrice
				}
	
			console.log("cartItem: ", cartItem)
		
			addToCart(token, cartItem)
				.then((response) => {
				console.log(response)
				setCartSuccessMsg(response?.data?.message || "added to cart")
	
				})
				.catch((error) => {
				console.log(error)
				setCartErrorMsg(error?.response?.data?.message || "failed to add to cart")
				})
	
			}else {
				setAuthenticatedAlertBeforeAddToCart(true) 
	
			}
			
	
	
		}



	return (
		<Layout title="Single Product" className="container">
            {loading && showLoading(loading)}
            {error && showError(error, errorMsg)}
            {success && showSuccess(success, successMsg)}

			{/* for cart  */}
			{authenticatedAlertBeforeAddToCart && showGeneralMessage("please login first!")}
			{cartSuccessMsg && showSuccess(true, cartSuccessMsg)}
			{cartErrorMsg && showError(true, cartErrorMsg )}

			<nav aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<Link to="/">Home</Link>
					</li>
					<li className="breadcrumb-item">
						<Link to="#">Product</Link>
					</li>
					<li className="breadcrumb-item">
						<span>{product?.category?.name ? product.category.name : ""}</span>
					</li>
				</ol>
			</nav>

			<div className="card mb-3">
				<div className="row">

					<div className="col-sm-5">

                        <img
                            src={`${API}/product/photo/${_id}`}
                            className="rounded img-fluid w-100 h-100 border"
                            alt={name}
                        />

					</div>

					<div className="col-sm-7">
						<div className="card-body">
							<h5 className="card-title">{name}</h5>

							<p className="card-text">TK : {price}</p>

							<p className="card-text">
                                {quantity ? (<span className="badge badge-pill badge-primary rounded-5">stock</span>) : (<span className="badge badge-pill badge-danger rounded-5">out of stock</span>) }
                            </p>

							<p className="card-text">{description}</p>

                            {quantity && (<button className="btn btn-outline-primary"
							onClick={() => {
								handleAddToCart(_id, price)
							}}
							>
                                Add To Cart</button>) }

						</div>
					</div>

				</div>
			</div>

		</Layout>
	);
};

export default ProductDetails;
