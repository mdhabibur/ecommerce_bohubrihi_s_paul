import { Link } from "react-router-dom"
import { API } from "../../utils/config"
import { addToCart } from "../../api/users/cartApi"
import { isAuthenticated, userInfo } from "../../utils/auth"
import { showGeneralMessage } from "../../utils/responseMessages"
import { useState } from "react"



const Card = ({ product, handleAddToCart }) => {


    const titleStyle = {
        display: "block",
        textOverflow: "ellipsis",
        wordWrap: "break-word",
        overflow: "hidden",
        maxHeight: "2em",
        lineHeight: "1em"
    }

    const imgContainerStyle = {
        height: "200px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ccbcbc21"
    }

    const imgStyle = {
        maxHeight: "100%",
        maxWidth: "100%",
        objectFit: "contain",
        
    }


    return (
        <>

          <div className="col-md-3 col-sm-4 col-xs-12">
            <div className="card my-2">
               <div style={imgContainerStyle} className="border border-2 border rounded-5">
                <img
                        src={`${API}/product/photo/${product._id}`}
                        alt={product.name}
                        style={imgStyle}
                        className="card-img-top border border-2 rounded-5"
                    />
               </div>


                <div className="card-body">

                    <div style={{ minHeight: "3em" }}>
                        <p style={titleStyle}>{product.name}</p>
                    </div>

                    <span style={{ fontSize: 20 }}>&#2547;</span>{product.price}

                    <p>{product.quantity ? (<span className="badge badge-pill badge-primary">In Stock</span>) : (<span className="badge badge-pill badge-danger">Out of Stock</span>)}</p>

                    <Link to={`/product/${product._id}`}>
                        <button className="btn btn-outline-warning btn-sm">View Product</button>
                    </Link>

                    {product.quantity ? <>
                        &nbsp;<button className="btn btn-outline-primary btn-sm my-3"
                        onClick={() => {
                            handleAddToCart(product._id, product.price)
                        }}
                         >Add to Cart</button>
                    </> : ""}

                </div>
            </div>
        </div>
        </>

    )
}


export default Card

