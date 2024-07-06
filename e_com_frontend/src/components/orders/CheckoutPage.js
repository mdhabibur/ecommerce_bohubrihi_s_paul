import React, { useEffect, useState } from 'react'
import { getProfile } from '../../api/users/profileApi';
import { userInfo } from '../../utils/auth';
import { getCartItems } from '../../api/users/cartApi';
import Layout from '../Layout';
import { Link, useNavigate } from 'react-router-dom';

const CheckoutPage = () => {

    const [orderItems, setOrderItems] = useState([]);
    const navigate = useNavigate()

    const [values, setValues] = useState({
        phone: '',
        address1: '',
        address2: '',
        city: '',
        postcode: '',
        country: ''
    });

    const {
        phone,
        address1,
        address2,
        city,
        postcode,
        country
    } = values;

    const loadCart = () => {
        getCartItems(userInfo().token)
            .then(response => setOrderItems(response.data))
            .catch((err => console.log(err)));
    }

    useEffect(() => {
        getProfile(userInfo().token)
            .then(response => {
                if(response.data.profile !== null){
                    setValues(response.data.profile)
                }else {
                    navigate("/user/shipping")
                }

            })
            .catch(err => { })
        loadCart();
    }, []);


    const orderTotalPrice = () => {
        const totalPrice = orderItems.reduce((initialPrice, cartItem) => initialPrice + cartItem.price ,0)
        return totalPrice

    }


    const shippingDetails = () => (
        <>
            To,
            <br /> <b>{userInfo().name}</b>
            <br /> Phone: {phone}
            <br /> {address1}
            {address2 ? (<><br />{address2}</>) : ""}
            <br /> {city}-{postcode}, {country}
        </>
    )

    return (<>
        <Layout title="Checkout" description="Complete your order!" className="container">

            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><Link to="/">Order</Link></li>
                    <li class="breadcrumb-item"><Link to="/user/cart">Cart</Link></li>
                    <li class="breadcrumb-item"><Link to="/user/shipping">Shipping Address</Link></li>
                    <li class="breadcrumb-item active" aria-current="page">Checkout</li>
                </ol>
            </nav>

            <div className="container">
                <div className="row">

                    <div className="col-md-8">
                        <div className="card mb-5" style={{ height: 'auto' }}>
                            <div className="card-header">Shipping Details</div>
                            <div className="card-body">
                                {shippingDetails()}
                            </div>
                        </div>
                    </div>


                    <div className="col-md-4">

                        <div className="card" style={{ height: 'auto' }}>
                            <div className="card-body">
                                
                                <ul className="list-group list-group-flush">
                                    {orderItems.map(item => 
                                        (<li key={item._id} className="list-group-item" 
                                        align="right">

                                            {item.product ? item.product.name : ""} x {item.count} = ৳ {item.price}

                                        </li>))}
                                </ul>

                            </div>
                            <div className="card-footer">
                                <span className="float-left"><b>Order Total</b></span>
                                <span className="float-right"><b>৳ {orderTotalPrice()}</b></span>
                            </div>
                        </div>

                        <br />
                        <p><Link className="btn btn-warning btn-md" to="/user/payment">Make Payment</Link></p>
                    </div>
                </div>
            </div>
        </Layout>
    </>);
}

export default CheckoutPage