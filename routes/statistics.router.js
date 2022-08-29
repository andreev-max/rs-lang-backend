const router = require('express').Router();
const authMiddleware = require('../auth.middleware');
const User = require('../models/user.model');
const { transformStats, getUserStats } = require('../utils/statsFunctions');
const { getStatisticsMessage } = require('../utils/getMessage');

router.post('/statistics', authMiddleware, async (req, res) => {
	try {
		const { correctArr, failArr, seriesArr, gameName } = req.body;
		const transformed = transformStats({ correctArr, failArr, seriesArr, gameName });
		const user = await User.findById(req.user.userId);
		const userWords = user.words;
		let newWordsCount = 0;

		[ ...correctArr, ...failArr ].forEach((word) => {
			if (!userWords.find((item) => `${item._id}` == `${word._id}`)) {
				userWords.push(word);
				newWordsCount++;
			}
		});

		userWords.forEach((word) => {
			if (correctArr.find((item) => `${item._id}` == `${word._id}`)) {
				word.correct++;
			}
			if (failArr.find((item) => `${item._id}` == `${word._id}`)) {
				word.fail++;
			}
		});

		const newUser = await User.findByIdAndUpdate(
			req.user.userId,
			{
				$push: { statistics: transformed },
				$set: { words: userWords }
			},
			{ new: true }
		);
		const parsedStats = getUserStats(newUser.statistics);
		const message = getStatisticsMessage(newWordsCount);
		res.status(200).json({ statistics: parsedStats, userWords: newUser.words, message });
	} catch (e) {
		console.log('post stats', e);
		res.status(400).send(e);
	}
});

module.exports = router;
