const router = require('express').Router({ mergeParams: true });
const { refresh } = require('../utils/refreshToken');

router.get('/', async (req, res) => {
	try {
		console.log('id in get token', req.userId);
		const tokens = await refresh(req.userId, req.tokenId);
		res.status(200).send(tokens);
	} catch (e) {
		console.log('get word by id', e);
		res.status(400).send(e);
	}
});

module.exports = router;
