const SSLCommerz = require("ssl-commerz-node");
const { CartItem } = require("../models/CartItem");
const Profile = require("../models/Profile");
const path = require("path");
const CompletedOrder = require("../models/CompletedOrder");
const { Payment } = require("../models/Payment");
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

	const tran_id = trans_id()

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
		tran_id: tran_id, // Unique Transaction id
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


	const completedOrder = new CompletedOrder({
		cartItems: cartItems,
		tran_id: tran_id,
		address: profile,
		user: userId,
	})


	payment
		.paymentInit()
		.then(async (response) => {

            //now put the sessionKey to the completedOrder obj
			if(response){

				completedOrder['sessionKey'] = response.sessionkey
				await completedOrder.save()


				console.log("session key: ", response.sessionkey)
				console.log("completedOrder: ", completedOrder)

				return res.status(200).send({
					response: response,
	
					// user: user,
					// cartItems: cartItems,
					// totalPrice: totalPrice,
					// totalItems: totalItems,
					// trans_id: trans_id(),
					// profile: profile
	
					completedOrder: completedOrder,
				});
			}

		})
		.catch((error) => {
			console.log(error)
			return res.status(500).send(error)
		});
};

const ipnHandler = async (req, res) => {
	console.log(req.body);

	try {

        const payment = new Payment(req.body)
		const completedOrder =  await CompletedOrder.findOne({tran_id: payment.tran_id})

        if(req.body.status === 'VALID'){

			if(completedOrder){
				try {
				
					completedOrder['status'] = "Completed"
					await completedOrder.save()
					await payment.save()
					await CartItem.deleteMany({user: completedOrder.user})

					return res.status(200).send({
						message: "order and payment processed successfully"
					})
	
		
				} catch (error) {
					console.log(error)
					return res.status(500).send({
						message: "error in payment and completing order",
						error: error
					})
					
				}

			}



        }else{
			await payment.save()
			return res.status(500).send({
				message: "order not completed and payment is not successful"
			})

		}
        

    } catch (error) {

		return res.status(500).send({
			message: "order and payment failed to process",
			error: error
		})
        
    }
};

const ipnPaymentSuccessHandler = async (req, res) => {
	try {
        const successFilePath = path.join(global.__basedir, 'public', 'paymentSuccess.html')
        return res.status(200).sendFile(successFilePath)
	} catch (error) {
        return res.status(500).send(error)
    }
};

const ipnPaymentFailureHandler = async (req, res) => {
    try {
        const paymentFailurePath = path.join(global.__basedir, 'public', 'paymentFailure.html')
        return res.status(200).sendFile(paymentFailurePath)
        
    } catch (error) {
        return res.status(500).send(error)

    }

}


const ipnPaymentCancelHandler = async (req, res) => {
    try {
        const paymentCancelPath = path.join(global.__basedir, 'public', 'paymentCancel.html')
        return res.status(200).sendFile(paymentCancelPath)
        
    } catch (error) {
        return res.status(500).send(error)

    }
    
}

module.exports = { initPayment, ipnHandler, ipnPaymentSuccessHandler, ipnPaymentFailureHandler, ipnPaymentCancelHandler };
