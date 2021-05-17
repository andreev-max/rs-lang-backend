const router = require('express').Router();
const authMiddleware = require('../auth.middleware');
const User = require('../models/user.model');

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
		res.status(200).json({ settings: user.settings, message: 'Изменили ваши настройки' });
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});

module.exports = router;
