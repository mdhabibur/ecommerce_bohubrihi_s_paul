import React, { useEffect } from "react";
import Menu from "./Menu";

const Layout = ({ title, className, children }) => {

    useEffect( () => {
        document.title = title
    }, [title])

	return (
		<>
			<Menu />

			<div className={`${className} m-4`}>
                {children}
            </div>
		</>
	);
};

export default Layout;
