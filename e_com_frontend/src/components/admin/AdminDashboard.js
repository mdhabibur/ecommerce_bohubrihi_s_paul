import React, { useEffect } from "react";
import Layout from "../Layout";
import Menu from "../Menu";
import { Link, useNavigate } from "react-router-dom";
import { userInfo } from "../../utils/auth";

const AdminDashboard = () => {

   const user =  userInfo()
   const {name, email, role} = user


    const UserLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">User Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/category">Create Category</Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/product">Create Product</Link>
                    </li>
                </ul>
            </div>
        )
    };


    const UserInfo = () => (
        <div className="card mb-5">
            <h3 className="card-header">User Information</h3>
            <ul className="list-group">
                <li className="list-group-item"><b>Name: </b>{name}</li>
                <li className="list-group-item"><b>Email: </b>{email}</li>
                <li className="list-group-item"><b>Role: </b>{role}</li>
            </ul>
        </div>
    );

	return (
		<Layout title="Admin Dashboard" className="container">
			<div className="row">
                <div className="col-md-3">
                    <UserLinks />
                </div>
                <div className="col-md-9">
                    <UserInfo />
                </div>
            </div>
		</Layout>
	);
};

export default AdminDashboard;
