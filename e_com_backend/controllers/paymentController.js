const SSLCommerz = require("ssl-commerz-node");
const { CartItem } = require("../models/CartItem");
const Profile = require("../models/Profile");
const path = require("path");
const PaymentSession = SSLCommerz.PaymentSession;
require("dotenv").config();

const initPayment = async (req, res) => {
	const user = req.user;
	const userId = user._id;

	const cartItems = await CartItem.find({ user: userId });
	const profile = await Profile.findOne({ user: userId });

	const totalPrice = cartItems
		.map((cartItem) => cartItem.price)
		.reduce((previous, current) => previous + current, 0);

	const totalItems = cartItems
		.map((cartItem) => cartItem.count)
		.reduce((previous, current) => previous + current, 0);

	const trans_id = () => {
		const timestamp = Date.now();
		const randomNumber = Math.floor(Math.random() * 1000000);
		return `tran_${timestamp}_${randomNumber}`;
	};

	// For live payment set first parameter `false` and for sandbox set it `true`
	const payment = new PaymentSession(
		true,
		process.env.SSLCOMMERZ_STORE_ID,
		process.env.SSLCOMMERZ_STORE_PASSWORD
	);

	//set the urls
	payment.setUrls({
		success:
			"https://ecommerce-bohubrihi-s-paul.onrender.com/api/payment/success", // If payment Succeed
		fail: "https://ecommerce-bohubrihi-s-paul.onrender.com/api/payment/fail", // If payment failed
		cancel:
			"https://ecommerce-bohubrihi-s-paul.onrender.com/api/payment/cancel", // If user cancel payment
		ipn: "https://ecommerce-bohubrihi-s-paul.onrender.com/api/payment/ipn", // SSLCommerz will send http post request in this link
	});

	// Set order details
	payment.setOrderInfo({
		total_amount: totalPrice, // Number field
		currency: "BDT", // Must be three character string
		tran_id: trans_id(), // Unique Transaction id
		emi_option: 0, // 1 or 0
	});

	// Set customer info
	payment.setCusInfo({
		name: user.name,
		email: user.email,
		add1: profile.address1,
		add2: profile.address2,
		city: profile.city,
		state: profile.city,
		postcode: profile.postcode,
		country: profile.country,
		phone: profile.phone,
		fax: "Customer_fax_id",
	});

	// Set shipping info
	payment.setShippingInfo({
		method: "Courier", //Shipping method of the order. Example: YES or NO or Courier
		num_item: totalItems,
		name: user.name,
		add1: profile.address1,
		add2: profile.address2,
		city: profile.city,
		state: profile.city,
		postcode: profile.postcode,
		country: profile.country,
	});

	// Set Product Profile
	payment.setProductInfo({
		product_name: "there may be multiple products",
		product_category: "General",
		product_profile: "general",
	});

	payment
		.paymentInit()
		.then((response) => {
			res.send({
				response: response,

				// user: user,
				// cartItems: cartItems,
				// totalPrice: totalPrice,
				// totalItems: totalItems,
				// trans_id: trans_id(),
				// profile: profile
			});
		})
		.catch((error) => res.send(error));
};

const ipnHandler = async (req, res) => {
	console.log(req.body);
};

const ipnPaymentSuccessHandler = async (req, res) => {
	try {
        const successFilePath = path.join(global.__basedir, 'public', 'paymentSuccess.html')
        res.sendFile(successFilePath)
	} catch (error) {
        res.send(error)
    }
};

module.exports = { initPayment, ipnHandler, ipnPaymentSuccessHandler };
