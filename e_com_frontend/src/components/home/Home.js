import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { Navigate } from "react-router-dom";
import { isAuthenticated, userInfo } from "../../utils/auth";
import { filterProducts, getProducts } from "../../api/admin/productApi";
import Card from "./Card";
import { showError, showGeneralMessage, showLoading, showSuccess } from "../../utils/responseMessages";
import { getCategories } from "../../api/admin/categoryApi";
import Checkbox from "./Checkbox";
import CheckBox from "./Checkbox";
import RadioButton from "./RadioButton";
import priceRangesFromFile from "./priceRanges"
import { addToCart } from "../../api/users/cartApi";

const Home = () => {

	const [products, setProducts] = useState([])
	const [categories, setCategories] = useState([])

	const [authenticatedAlertBeforeAddToCart, setAuthenticatedAlertBeforeAddToCart] = useState(false)
	const [cartSuccessMsg, setCartSuccessMsg] = useState('')
	const [cartErrorMsg, setCartErrorMsg] = useState('')


	const [sortBy, setSortBy] = useState('price')
	const [order, setOrder] = useState('desc')
	const [limit, setLimit] = useState(10)
	const [skip, setSkip] = useState(0)

	const [priceRanges, setPriceRanges] = useState([])


	const [error, setError] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [loading, setLoading] = useState(false);


	const [filters, setFilters] = useState({
		price: [],
		category: []
	
	})

	useEffect(() => {

		setLoading(true)

		//load priceRanges
		setPriceRanges(priceRangesFromFile)

		//fetch products
		const response = getProducts(sortBy, order, limit)
				.then((response) => {
					setProducts(response.data.products)

					//2. success state
					setLoading(false)
					setError(false)
					setSuccess(true)
					setSuccessMsg(response?.data?.message || "fetched products successfully")
					

				})
				.catch( (error) => {
					console.log(error)
					//3. rejected state
					setLoading(false)
					setError(true)
					setSuccess(false)
					setErrorMsg(error.response?.data?.message || "fetching products failed")
					console.log(error)
				})

			//fetch categories
			getCategories()
			.then((response) => {
				// console.log("categories:", response.data)
				setCategories(response.data)
			})
			.catch( (error) => {
				console.log(error)
			})

	}, [])



	useEffect( () => {

		if(error || success){
			const timer = setTimeout( () => {
				setError(false)
				setSuccess(false)

			}, 5000)

			return () => clearTimeout(timer)

		}

		if(authenticatedAlertBeforeAddToCart || cartSuccessMsg || cartErrorMsg){
			const timer = setTimeout(() => {
				setAuthenticatedAlertBeforeAddToCart(false)
				setCartSuccessMsg("")
				setCartErrorMsg("")
			}, 5000)

			return () => clearTimeout(timer)

		}

	}, [error, success, authenticatedAlertBeforeAddToCart, cartSuccessMsg, cartErrorMsg])





	console.log("products:", products)

		
	const handleFilter = (myFilters, filterBy) => {

		const newFilters = {...filters}

		if(filterBy === 'category'){
			newFilters[filterBy] = myFilters
		}

		if(filterBy === 'price'){
			newFilters[filterBy] = myFilters
		}

		setFilters(newFilters)

		try {
			const filterObj = {
				order: order,
				sortBy: sortBy,
				limit: limit,
				skip: skip,
				filters: newFilters
			}

			console.log("filterObj: ", filterObj)

			filterProducts(filterObj)
				.then((response) => {
					setProducts(response.data.product)
					console.log("filterd products: ", response.data)
				})
			} catch (error) {
				console.log(error)
			}


	}


	const showFilters = () => {
        return (
            <>
                <div className="row">

                    <div className="col-sm-3">
                        <h6 className="mb-3">Filter By Categories:</h6>
                        <ul>
                            <CheckBox
                                categories={categories}
								handleFilter = {(myFilters) => handleFilter(myFilters, 'category' )}
                            />
                        </ul>

						{/* {JSON.stringify(filters)} */}

                    </div>

					<div className="col-sm-3 mx-md-3">
                        <h6 className="mb-3">Filter By Prices:</h6>
                        <ul className="">
                            <RadioButton
                                priceRanges={priceRanges}
								handleFilter={(priceFilter)=> handleFilter(priceFilter, 'price')}
                            />
                        </ul>

						{/* {JSON.stringify(filters)} */}

                    </div>


                </div>
            </>
        )
    }


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
		<Layout title="Home Page" className="container">

			{/* for products  */}
			{showFilters()}
			{loading && showLoading(loading)}
			{error && showError(error, errorMsg)}
			{success && showSuccess(success, successMsg)}


			{/* for cart  */}
			{authenticatedAlertBeforeAddToCart && showGeneralMessage("please login first!")}
			{cartSuccessMsg && showSuccess(true, cartSuccessMsg)}
			{cartErrorMsg && showError(true, cartErrorMsg )}


			<div className="row">
				{products.map((product) => <Card 
				product = {product}
				handleAddToCart={(productId, productPrice) => {
					handleAddToCart(productId, productPrice)
				}}
				key={product._id}
				/>)}

			</div>

		</Layout>
	);
};

export default Home;
