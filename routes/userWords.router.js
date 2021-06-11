const router = require('express').Router({ mergeParams: true });
const User = require('../models/user.model');
const authMiddleware = require('../auth.middleware');
const { getUserWordsMessage } = require('../utils/getMessage');

router.get('/userWords', authMiddleware, async (req, res) => {
	try {
		const userId = req.user.userId;
		const user = await User.find({ userId });
		res.status(200).json({ userWords: user.words, message: 'Ваши слова доставлены' });
	} catch (e) {
		console.log('get user words', e);
		res.status(400).send(e);
	}
});

router.post('/updateWord', authMiddleware, async (req, res) => {
	try {
		const { wordId, name, value, wordName } = req.body;
		const newValue = value === 'false' ? true : false;
		const message = getUserWordsMessage(name, newValue, wordName);
		const user = await User.findById(req.user.userId);
		const userWords = user.words;
		if (name === 'deleted' && newValue === false) {
			const newUserWords = await userWords.filter((item) => `${item._id}` != `${wordId}`);
			const newUser = await User.findByIdAndUpdate(
				req.user.userId,
				{
					$set: { words: newUserWords }
				},
				{ new: true }
			);
			res.status(200).json({ userWords: newUser.words, message });
		} else {
			userWords.forEach((item) => {
				if (`${item._id}` == `${wordId}`) {
					item[name] = newValue;
				}
			});
			const newUser = await User.findByIdAndUpdate(
				req.user.userId,
				{
					$set: { words: userWords }
				},
				{ new: true }
			);
			res.status(200).json({ userWords: newUser.words, message });
		}
	} catch (e) {
		console.log('update word', e);
		res.status(400).send(e);
	}
});

module.exports = router;
