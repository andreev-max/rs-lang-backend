const router = require('express').Router({ mergeParams: true });
const Words = require('../models/word.model');
const User = require('../models/user.model');
const { getMessage } = require('../utils/wordsCount');
const authMiddleware = require('../auth.middleware');

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
		console.log(req.body);
		const newValue = req.body.value === 'false' ? true : false;
		const user = await User.findById(req.user.userId);
		const userWords = user.words;
		if (req.body.name === 'deleted' && newValue === false) {
			console.log('ПОПАЛ В БЛОК IF');
			console.log(typeof userWords);
			console.log(userWords.length);
			const newUserWords = await userWords.filter((item) => `${item._id}` != `${req.body.wordId}`);
			console.log(newUserWords.length);
			const newUser = await User.findByIdAndUpdate(
				req.user.userId,
				{
					$set: { words: newUserWords }
				},
				{ new: true }
			);
			res.status(200).json({ userWords: newUser.words, message: 'Это слово удалено из списка ваших слов' });
		} else {
			userWords.forEach((item) => {
				if (`${item._id}` == `${req.body.wordId}`) {
					item[req.body.name] = newValue;
				}
			});
			const newUser = await User.findByIdAndUpdate(
				req.user.userId,
				{
					$set: { words: userWords }
				},
				{ new: true }
			);
			res.status(200).json({ userWords: newUser.words, message: 'Изменили слово' });
		}
	} catch (e) {
		console.log('update word', e);
		res.status(400).send(e);
	}
});

// router.post('/:wordId', async (req, res) => {
// 	try {
// 		const userId = req.userId;
// 		const wordId = req.params.wordId;
// 		const wordBody = req.body;
// 		const wordEntity = await User.findOne({ wordId, userId });
// 		let allUserWords = [];
// 		if (wordEntity) {
// 			const updatedWord = await User.findOneAndUpdate({ wordId, userId }, { $set: wordBody }, { new: true });
// 			if (!updatedWord) {
// 				res.status(400).json({ message: 'слово не смогло обновиться' });
// 			}
// 			allUserWords = await UserWord.findById(userId);
// 			res.status(200).json({ allUserWords, updatedWord, message: 'нашёл' });
// 		} else {
// 			const newUserWord = await User.create({
// 				...wordBody,
// 				userId,
// 				wordId
// 			});
// 			allUserWords = await User.findById(userId);
// 			res.status(200).json({ allUserWords, newUserWord, message: 'создал' });
// 		}
// 	} catch (e) {
// 		console.log('user word id', e);
// 		res.status(400).send(e);
// 	}
// });

// router.delete('/:wordId', async (req, res) => {
// 	const wordId = req.params.wordId;
// 	const userId = req.userId;
// 	await UserWord.deleteOne({ wordId, userId });
// 	res.status(200).json({ message: 'Слово восстановлено' });
// });

module.exports = router;
