import React, { useEffect, useState } from 'react'
import { userInfo } from '../../utils/auth';
import { getProfile, setProfile } from '../../api/users/profileApi';
import Layout from '../Layout';
import { showError, showLoading, showSuccess } from '../../utils/responseMessages';
import { Link } from 'react-router-dom';

const UserProfile = () => {


const [values, setValues] = useState({
    phone: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    country: '',
});

const [error, setError] = useState(false);
const [errorMsg, setErrorMsg] = useState("");
const [success, setSuccess] = useState(false);
const [successMsg, setSuccessMsg] = useState("");
const [loading, setLoading] = useState(false);



const {
    phone,
    address1,
    address2,
    city,
    postcode,
    country,
} = values;

useEffect(() => {
    getProfile(userInfo().token)
        .then((response) => {
            if(response.data.profile !== null){
                setValues(response.data.profile)
            }

        })
        .catch((error) => {
            console.log(error)
        })

}, []);


const handleChange = (e) => {

    setValues({
        ...values,
        [e.target.name]: e.target.value
    })


}

const handleSubmit = (e) => {
    e.preventDefault()

    setLoading(true)
    setError(false)
    setSuccess(false)

    setProfile(userInfo().token, values)
        .then((response) => {
            console.log("profile: ", response)
            setLoading(false)
            setError(false)
            setSuccess(true)
            setSuccessMsg(response?.data?.message || "user profile set")

            //means profile created or updated


        })
        .catch((error) => {
            console.log(error)
            setLoading(false)
            setError(true)
            setErrorMsg(error?.response?.data?.message || "failed to set profile")
            setSuccess(false)
        })

}

	//show messages for 5 seconds
	useEffect( () => {
		if(error || success || loading){
			const timer = setTimeout(() => {

				if(loading){
                    alert("timeout for set")
                }

				setLoading(false)
				setError(false)
				setSuccess(false)
			}, 5000);

			return () => clearTimeout(timer)
		}


	}, [loading, error, success])



const profileForm = () => (<form onSubmit={handleSubmit}>

    <label className="text-muted">Phone:</label>
    <input name="phone" value={phone} required className="form-control" onChange={handleChange} />

    <label className="text-muted">Address 1:</label>
    <input name="address1" value={address1} required className="form-control" onChange={handleChange} />

    <label className="text-muted">Address 2:</label>
    <input name="address2" value={address2} className="form-control" onChange={handleChange} />

    <div className="row">

        <div className="col-4">
            <label className="text-muted">City:</label>
            <input name="city" value={city} required className="form-control" onChange={handleChange} />
        </div>

        <div className="col-4">
            <label className="text-muted">Post Code: </label>
            <input name="postcode" value={postcode} type="number" required className="form-control" onChange={handleChange} />
        </div>

        <div className="col-4">

            <label className="text-muted">Country:</label>
            <input name="country" value={country} required className="form-control" onChange={handleChange} />

            <br />

            <button type="submit" className="btn btn-primary btn-sm float-right"
            disabled={loading}>Save</button>

        </div>
    </div>
</form>)

return (<>
    <Layout title="Checkout" description="Complete your order!" className="container">

        {loading && showLoading(loading)}
        {error && showError(error, errorMsg)}
        {success && showSuccess(success, successMsg)}

        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">

                <li className="breadcrumb-item"><Link   to="/">Order</Link></li>

                <li className="breadcrumb-item"><Link to="/user/cart">Cart</Link></li>

                <li className="breadcrumb-item active" aria-current="page">Shipping Address</li>

            </ol>
        </nav>
        <div className="container">

            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-5" style={{ height: 'auto' }}>
                        <div className="card-header">Shipping Address</div>
                        <div className="card-body">
                            {profileForm()}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </Layout>
</>);


}

export default UserProfile