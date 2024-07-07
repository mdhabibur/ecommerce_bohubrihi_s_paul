import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated, signOut, userInfo } from "../utils/auth";

const Menu = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const isActivated = (path) => {

		return location.pathname === path ? "activeLink" : "";
	};

	return (
		<>
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
				<div className="container">

				<Link className="navbar-brand" to="/">
				<img className= "mr-1" src="/assets/logo.png" alt="Bootstrap" width="30" height="30"
				 />MA_ECOM
				</Link>

				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapseContent" aria-controls="navbarCollapseContent" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
				</button>


				<div className="collapse navbar-collapse justify-content-end" id="navbarCollapseContent">

					<ul className="navbar-nav nav-tabs">
						<li className="nav-item large_nav_links mx-2">
							<Link to="/" className={`${isActivated("/")} nav-link `}>
								Home
							</Link>
						</li>

						{!isAuthenticated() && (
							<>
								<li className="nav-item large_nav_links mx-2">
									<Link
										to="/login"
										className={`${isActivated("/login")} nav-link `}
									>
										Login
									</Link>
								</li>

								<li className="nav-item large_nav_links mx-2">
									<Link
										to="/register"
										className={`${isActivated("/register")} nav-link`}
									>
										Register
									</Link>
								</li>
							</>
						)}

						{isAuthenticated() && (
							<>
								<li className="nav-item large_nav_links mx-2">
									<Link
										to={`/${userInfo().role}/dashboard`}
										className={`${isActivated(
											`/${userInfo().role}/dashboard`
										)} nav-link`}
									>
										Dashboard
									</Link>
								</li>

								<li className="nav-item large_nav_links mx-2">
									<Link
										to={`/user/cart`}
										className={`${isActivated(`/user/cart`)} nav-link`}
									>
										Cart
									</Link>
								</li>

								<li className="nav-item large_nav_links mx-2">
									<span
										className="nav-link"
										style={{ cursor: "pointer" }}
										onClick={() => {
											signOut(() => {
												navigate("/login");
											});
										}}
									>
										Logout
									</span>
								</li>
							</>
						)}
					</ul>

				</div>
				</div>

			</nav>
		</>
	);
};

export default Menu;
