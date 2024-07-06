import Layout from '../Layout';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import { useEffect, useState } from 'react';
import { deleteCartItem, getCartItems, updateCartItem } from '../../api/users/cartApi';
import { showError, showLoading, showSuccess } from '../../utils/responseMessages';
import { userInfo } from '../../utils/auth';

const Cart = () => {

    const [cartItems, setCartItems] = useState([])


    const [error, setError] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [loading, setLoading] = useState(false);


    const [cartItemUpdateSuccess, setCartItemUpdateSuccess] = useState("")
    const [cartItemUpdateError, setCartItemUpdateError] = useState()


    const [cartItemDeleteSuccess, setCartItemDeleteSuccess] = useState("")
    const [cartItemDeleteError, setCartItemDeleteError] = useState()



    const retrieveCartItem = () => {
        setLoading(true)
        setError(false)
        setSuccess(false)

        getCartItems(userInfo().token)
            .then((response) => {
                console.log(response.data)
                setCartItems(response.data)

                setLoading(false)
                setSuccess(true)
                setSuccessMsg("Your Cart Items ")
                setError(false)
            })
            .catch((error) => {
                console.log(error)
                
                setLoading(false)
                setSuccess(false)
                setError(true)
                setErrorMsg(error?.response?.data?.message || "failed to retrieve cart items")

            })
        
    }

    useEffect(() => {

        retrieveCartItem()

    }, [])


    useEffect(() => {
        if(loading || error || success){
            const timer = setTimeout(() => {
                setLoading(false)
                setError(false)
                setSuccess(false)

            }, 5000)

            return () => clearTimeout(timer)
        }

        if(cartItemUpdateError || cartItemUpdateSuccess){
            const timer = setTimeout(() => {
                setCartItemUpdateError('')
                setCartItemUpdateSuccess("")

            }, 5000)

            return () => clearTimeout(timer)
        }


        if(cartItemDeleteSuccess || cartItemDeleteError){
            const timer = setTimeout(() => {
                setCartItemDeleteError('')
                setCartItemDeleteSuccess("")

            }, 5000)

            return () => clearTimeout(timer)
        }

    }, [loading, error, success, cartItemUpdateError, cartItemUpdateSuccess, cartItemDeleteSuccess, cartItemDeleteError])


    const totalPrice = () => {
        const totalPrice = cartItems.reduce((initialPrice, cartItem) => initialPrice + cartItem.price ,0)
        return totalPrice

    }

    const deleteCartItemHandler = (cartItemId) => {
        console.log("cart item id: ", cartItemId)

        const response = deleteCartItem(userInfo().token, cartItemId)
        .then((response) => {
            console.log("deleted item:", response.data)
            setCartItemDeleteSuccess(response?.data?.message || "cart Item deleted")
    
            retrieveCartItem()


        })
        .catch((error) => {
            console.log(error)
            setCartItemDeleteError(error?.response?.data?.message || "failed to delete cart item")

        })

        


    }

    const decreaseCount = (cartItem) => {
        if(cartItem.count === 1) return

        const updatedCartItem = {
            ...cartItem,
            count: cartItem.count - 1,
            price: (cartItem.count -1) * cartItem.product.price
        }

        updateCartItem(userInfo().token, updatedCartItem)
            .then((response) => {
                setCartItemUpdateSuccess(response?.data?.message || "cart item updated")

                //now fetch the updated cart items
                retrieveCartItem()

            })
            .catch((error) => {
                setCartItemUpdateError(error?.response?.data?.message || "cart item failed to update")

            })
            


    }

    const increaseCount = (cartItem) => {
        if(cartItem.count === 5) return

        const updatedCartItem = {
            ...cartItem,
            count: cartItem.count + 1,
            price: (cartItem.count +1) * cartItem.product.price
        }

        console.log("updated cart item: ", updatedCartItem)

        updateCartItem(userInfo().token, updatedCartItem)
                .then((response) => {
                    setCartItemUpdateSuccess(response?.data?.message || 'cart item updated')

                    retrieveCartItem()

                })
                .catch((error) => {
                    setCartItemUpdateError(error?.response?.data?.message || "failed to update cart item")

                })

    }



    return (
        <Layout title="Your Cart" description="Hurry up! Place your order!" className="container">

            {loading && showLoading(loading)}
            {error  && showError(error, errorMsg)}
            {success && showSuccess(success, successMsg)}

            {/*cart item update */}
            {cartItemUpdateSuccess && showSuccess(true, cartItemUpdateSuccess)}
            {cartItemUpdateError && showError(true, cartItemUpdateError)}

            {/* cart item removal  */}
            {cartItemDeleteSuccess && showSuccess(true, cartItemDeleteSuccess)}
            {cartItemDeleteError && showError(true, cartItemDeleteError)}



            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><Link to="#">Order</Link></li>
                    <li class="breadcrumb-item active" aria-current="page">Cart</li>
                </ol>
            </nav>
            <div className="container my-5">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col" width="15%">#</th>
                            <th scope="col">Image</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Quantity</th>
                            <th scope="col" align="right">Price</th>
                            <th scope="col">Remove</th>
                        </tr>
                    </thead>
                    <tbody>

                        {cartItems && cartItems.map((cartItem, index) => <CartItem 
                        cartItem={cartItem} 
                        key={cartItem._id}
                        index={index}
                        decreaseCount={(cartItem) => decreaseCount(cartItem)}
                        increaseCount={(cartItem) => increaseCount(cartItem)}
                        deleteCartItemHandler = {(cartItemId) => deleteCartItemHandler(cartItemId)}

                        />)}


                        <tr>
                            <th scope="row" />
                            <td className='' colSpan={3}>Total</td>
                            <td className="">৳: {totalPrice()} </td>
                            <td />
                        </tr>
                        <tr>
                            <th scope="row" />
                            <td colSpan={4} className=" text-right">
                                <Link to="/"><button className="btn btn-warning mr-4 my-2">Continue Shopping</button></Link>
                                <Link to="/user/shipping" className="btn btn-success mr-4">Proceed To Checkout</Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}

export default Cart;