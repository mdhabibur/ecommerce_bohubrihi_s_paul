const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},
	},
	{ timestamps: true }
);

//hash the password before saving the user model
userSchema.pre("save", async function (next) {
	if (this.isModified("password") || this.isNew) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}
	next();
});

//generate token
userSchema.methods.generateJWT = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			name: this.name,
			email: this.email,
			role: this.role,
		},
		process.env.JWT_SECRET_KEY,
		{ expiresIn: "600s" }
	);

	return token;
};

/*
const validateUser = user => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),  
    })
    return schema.validate(user)
}

*/

//frontend user login validation using middleware and joi

//joi schema

const signUpSchema = Joi.object({
	name: Joi.string().min(3).max(100).required(),
	email: Joi.string().min(5).max(255).required(),
	password: Joi.string().min(2).max(255).required(),
	role: Joi.string(),
});
const loginSchema = Joi.object({
	email: Joi.string().min(5).max(255).required(),
	password: Joi.string().min(2).max(255).required(),
});

const User = mongoose.model("User", userSchema);

// module.exports = User
// module.exports.validate = validateUser

module.exports = {
	signUpSchema,
	loginSchema,
	User,
};
