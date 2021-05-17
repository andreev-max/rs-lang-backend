const router = require('express').Router();
const Words = require('../models/word.model');

router.get('/words', async (req, res) => {
	try {
		const page = req.query.page || 0;
		const group = req.query.group || 0;
		if (isNaN(page) || isNaN(group)) {
			return res
				.status(400)
				.json({ message: 'Неправильные параметры: группа и страница должны быть валидными числами' });
		}
		const words = await Words.find({ group, page });
		res.status(200).json(words);
	} catch (e) {
		console.log('get words', e);
		res.status(400).send(e);
	}
});

router.get('/words/:id', async (req, res) => {
	try {
		console.log('id В роутере', req.params.id);
		const word = await Words.findOne({ _id: id });
		res.status(200).json(word);
	} catch (e) {
		console.log('get word by id', e);
		res.status(400).send(e);
	}
});

module.exports = router;
