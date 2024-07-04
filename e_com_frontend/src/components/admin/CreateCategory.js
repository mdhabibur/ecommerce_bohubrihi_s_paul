import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { Link } from 'react-router-dom'
import { createCategory } from '../../api/admin/categoryApi'
import { userInfo } from '../../utils/auth'
import { showError, showLoading, showSuccess } from '../../utils/responseMessages'

const CreateCategory = () => {


    const [formData, setFormData] = useState({
        name: '',
    }) 

    const {token} = userInfo()

    const [error, setError] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [success, setSuccess] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [loading, setLoading] = useState(false);

    const {name } = formData

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })

        console.log("formData:", formData)

    }


    const handleSubmit =  async (e) => {

        e.preventDefault()

        setLoading(true)
        setError(false)
        setSuccess(false)

        try {

            const response =  await createCategory(token, formData)
            console.log(response)
            
            setLoading(false)
            setError(false)
            setSuccess(true)
            setSuccessMsg(response?.data?.message)

            
        } catch (error) {
            console.log(error)
            
            setLoading(false)
            setError(true)
            setSuccess(false)
            setErrorMsg(error?.response?.data?.message || 'could not create category')
            
        }

    }

    useEffect( () => {

        if(loading || error || success) {
            const timer = setTimeout( () => {

                if(loading){
                    alert("timeout for category creation")
                }

                setLoading(false)
                setError(false)
                setSuccess(false)
            }, 5000)

            return () => clearTimeout(timer)

        }

    }, [loading, error, success])

    const categoryForm = () => {
        return (
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input
                        name="name"
                        type="text"
                        onChange={handleChange}
                        value={name}
                        autoFocus
                        required
                        className="form-control"
                    />
                </div>

                <button type="submit" className="btn btn-outline-primary">Create Category</button>
            </form>
        )
    }


    const goBack = () => {
        return (
            <div className='my-3'>
                <Link to = '/admin/dashboard' className='text-warning'>Go Back</Link>
            </div>
        )
    }

  return (
    <Layout title='category' className='container'>

        {loading && showLoading(loading)}
        {success && showSuccess(success, successMsg)}
        {error   && showError(error, errorMsg)}


        <hr />
        {categoryForm()}
        {goBack()}
        <hr />

    </Layout>
  )
}

export default CreateCategory