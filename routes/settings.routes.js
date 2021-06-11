const router = require('express').Router();
const authMiddleware = require('../auth.middleware');
const User = require('../models/user.model');
const { getSettingsMessage } = require('../utils/getMessage');

router.post('/settings', authMiddleware, async (req, res) => {
	try {
		const ID = req.user.userId;
		const { name, value } = req.body;
		const setting = `settings.${name}`;
		const user = await User.findByIdAndUpdate(
			ID,
			{
				$set: {
					[setting]: value
				}
			},
			{ new: true }
		);
		const message = getSettingsMessage(name, value);
		res.status(200).json({ settings: user.settings, message });
	} catch (e) {
		console.log('settings error', e);
		res.status(400).send(e);
	}
});

module.exports = router;
