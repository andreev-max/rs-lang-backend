const router = require('express').Router();
const User = require('../models/user.model');
const auth = require('../auth.middleware');

router.post('/name', auth, async function(req, res) {
	const ID = req.user.userId;
	try {
		const name = req.body.name;
		const user = await User.findByIdAndUpdate(ID, { $set: { name: name } }, { new: true });
		res.status(200).json({ name: user.name, message: `Ваш никнейм успешно был изменён на ${name}` });
	} catch (e) {
		console.log('name error', e);
		res.send(e);
	}
});

module.exports = router;
