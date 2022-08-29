const router = require('express').Router();
const AllWords = require('../models/allWords.model');

router.get('/allWords', async (req, res) => {
	try {
		const page = req.query.page || 0;
		const group = req.query.group || 0;
		if (isNaN(page) || isNaN(group)) {
			return res
				.status(400)
				.json({ message: 'Неправильные параметры: группа и страница должны быть валидными числами' });
		}
		const allWords = await AllWords.find({ group, page });
		res.status(200).json(allWords);
	} catch (e) {
		console.log('get words', e);
		res.status(400).send(e);
	}
});

module.exports = router;
