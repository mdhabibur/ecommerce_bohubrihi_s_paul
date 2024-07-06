const Profile = require("../models/Profile");

const getProfile = async (req, res) => {
	const userId = req.user._id;
	try {
		const profile = await Profile.findOne({ user: userId });
		return res.status(200).send({
			message: "got user profile",
			profile: profile,
		});
	} catch (error) {
		return res.status(500).send({
			message: "could not get user profile",
			error: error,
		});
	}
};

const setProfile = async (req, res) => {
	const userId = req.user._id;

	const userProfile = req.body;
	userProfile["user"] = userId;

	try {
		const isThereProfile = await Profile.findOne({ user: userId });
		console.log("is there profile: ", isThereProfile);

		if (!isThereProfile) {
			const newProfile = new Profile(userProfile);
			newProfile.save();
			return res.status(201).send({
				message: "user profile created",
				newProfile: newProfile,
				requestObj: req.user,
			});
		} else {
			const updatedProfile = await Profile.updateOne(
				{ user: userId },
				userProfile
			);
			return res.status(201).send({
				message: "user profile updated",
				updatedProfile,
				requestObj: req.user,
			});
		}
	} catch (error) {
		return res.status(500).send({
			message: "user profile error",
			error: error,
		});
	}
};

module.exports = { getProfile, setProfile };
