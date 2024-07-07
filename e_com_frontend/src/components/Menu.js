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
			<nav className="navbar navbar-dark bg-dark">
				<div className="container border">
					<div className="row justify-content-center w-100">
					<ul className="nav nav-tabs">
						<li className="nav-item large_nav_links">
							<Link to="/" className={`${isActivated("/")} nav-link `}>
								Home
							</Link>
						</li>

						{!isAuthenticated() && (
							<>
								<li className="nav-item large_nav_links">
									<Link
										to="/login"
										className={`${isActivated("/login")} nav-link `}
									>
										Login
									</Link>
								</li>

								<li className="nav-item large_nav_links">
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
								<li className="nav-item large_nav_links">
									<Link
										to={`/${userInfo().role}/dashboard`}
										className={`${isActivated(
											`{/${userInfo().role}/dashboard}`
										)} nav-link`}
									>
										Dashboard
									</Link>
								</li>

								<li className="nav-item large_nav_links">
									<Link
										to={`/user/cart`}
										className={`${isActivated(`/user/cart`)} nav-link`}
									>
										Cart
									</Link>
								</li>

								<li className="nav-item large_nav_links">
									<span
										className="nav-link text-primary"
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
