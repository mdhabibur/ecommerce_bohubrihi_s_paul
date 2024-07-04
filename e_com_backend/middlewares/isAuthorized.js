const jwt = require("jsonwebtoken");

const isAuthorized = async (req, res, next) => {
	const token = req.header("Authorization");

	if (!token) {
		return res.status(401).json({
			message: "access denied.No user token found",
		});
	} else {
		try {
			const decodedToken = await jwt.verify(
				token.split(" ")[1],
				process.env.JWT_SECRET_KEY
			);
			//not valid
			if(!decodedToken) {
				return  res.status(400).json({
					message: "access denied.No valid token",
				});
			} 

			req.user = decodedToken;
			next();
		} catch (err) {
            return res.status(400).json({
                message: "access denied.No valid token",
            });
        }
	}
};

module.exports = isAuthorized;
