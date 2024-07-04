import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../Layout'
import { Link, useNavigate } from 'react-router-dom'
import { getCategories } from '../../api/admin/categoryApi'
import { createProduct } from '../../api/admin/productApi'
import { userInfo } from '../../utils/auth'
import { showError, showLoading, showSuccess } from '../../utils/responseMessages'

const CreateProduct = () => {

    const navigate = useNavigate()
    const {token} = userInfo()

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        quantity: '',
        photo: null
        
    })

    const [categories, setCategories] = useState([])


    const [error, setError] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [loading, setLoading] = useState(false);

    //as soon as this page mounts , fetch the categories and set them to the dropdown
    useEffect( () => {
       getCategories()
       .then( (response) => {
        // console.log(response)
        setCategories(response.data)
       })
       .catch(error => {
        console.log("error fetching categories")

       })
    }, [])



    const {name, description, price, category, quantity, photo} = formData

    // console.log("categories: ", categories)


    const handleChange = (e) => {
        // console.log("files: ", e.target.files[0])
        const value = e.target.name === 'photo' ? e.target.files[0] : e.target.value

        setFormData((prevState) => (
            {
                ...prevState,
                [e.target.name] : value
            }

            ))

        console.log("formData: ", formData)

    }

    
    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        setError(false)
        setSuccess(false)

        try {

           const formDataToSend = new FormData()

           for(let key in formData) {
            formDataToSend.append(key, formData[key])
           }

           console.log("form data to send: ", formDataToSend.entries())

           const response = await createProduct(token, formDataToSend)

           console.log("response: ", response)
           setLoading(false)
           setError(false)
           setSuccess(true)
           setSuccessMsg(response.data.message || "product created")

        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
            setErrorMsg(error.response?.data?.message || "product could not be created")
            setSuccess(false)
            
        }

    }



    //show messages for a certain period
    useEffect( () => {

        if(loading || error || success){

            const timer = setTimeout( () => {

                if(loading){
                    alert("timeout for product creation")
                }

                setLoading(false)
                setError(false)
                setSuccess(false)

               }, 5000)

            return () => {
                clearTimeout(timer)
            }
        }


    }, [loading, error, success])



    const ProductForm = () => (
        <form className="mb-3" onSubmit={handleSubmit}>
            <h4>Photo:</h4>

            <div className="form-group">
                <label className="btn btn-secondary">
                    <input
                        type="file"
                        name="photo"
                        onChange={handleChange}
                        accept="image/*"
                    />
                </label>
                {photo && <span>{photo.name}</span>}
            </div>

            <div className="form-group">
                <label className="text-muted">Name:</label>
                <input
                    name="name"
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    value={name}
                    required
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Description:</label>
                <textarea
                    name="description"
                    onChange={handleChange}
                    className="form-control"
                    value={description}
                    required
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Price:</label>
                <input
                    name="price"
                    onChange={handleChange}
                    className="form-control"
                    type="number"
                    value={price}
                    required
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Quantity:</label>
                <input
                    name="quantity"
                    onChange={handleChange}
                    className="form-control"
                    type="number"
                    value={quantity}
                    required
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Category:</label>
                <select name="category" value={category} onChange={handleChange} className="form-control" required>

                    <option value = "">---Select Category---</option>

                    {categories.map( (category) => <option value={category._id} key={category._id}>{category.name}</option>)}
                
                </select>
            </div>
            <button className="btn btn-outline-primary" type="submit" disabled={loading}>Create Product</button>
        </form>
    );

    const GoBack = () => {
        return (
            <div>
                <Link to = '/' className='text-warning'>Go Back</Link>
            </div>
        )

    }

  return (
        <Layout className='container' title='upload product'>
            
            {loading && showLoading(loading)}
            {error   && showError(error, errorMsg)}
            {success && showSuccess(success, successMsg)}

            <hr />
            {<ProductForm />}
            {<GoBack />}
            <hr />
        </Layout>
  )
}

export default CreateProduct