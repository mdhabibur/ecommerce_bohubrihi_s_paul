import React from 'react';
import { API } from '../../utils/config';
import { Link } from 'react-router-dom';

const CartItem = ({cartItem, index, decreaseCount, increaseCount, deleteCartItemHandler}) => {
    return (
        <tr>
            <th scope="row">{index + 1}</th>
            <th> 
            <img src={`${API}/product/photo/${cartItem.product._id}`} alt={cartItem.product.name} className="img-fluid" style={{ maxWidth: '50px', maxHeight: '50px' }} />

            </th>
            <td>{cartItem.product.name}</td>
            <td>
                <button 
                className="btn btn-outline-primary btn-sm m-2"
                onClick={() => decreaseCount(cartItem)}
                >-</button>
                <button 
                className="btn btn-outline-primary btn-sm m-2"
                onClick={() => increaseCount(cartItem)}
                >+</button>
            </td>
            <td>৳: {cartItem.count} x {cartItem.product.price} = { cartItem.price}  </td>
            <td>
                <button 
                className="btn btn-danger btn-sm"
                onClick={() => deleteCartItemHandler(cartItem._id)}
                > Remove From Cart</button>
                </td>
        </tr>)
};


export default CartItem;