import React, { useEffect } from "react";
import Menu from "./Menu";

const Layout = ({ title, className, offsetMd3, children }) => {

    useEffect( () => {
        document.title = title
    }, [title])

	return (
		<div className="gray_background">
			<Menu />

			<div className={`${className} my-3`}>
				<div className="row">
					<div className={offsetMd3 ? `col-md-6 ${offsetMd3}` : `col-md-12`}
					>

						{children}
					</div>
				</div>
            </div>
		</div>
	);
};

export default Layout;
