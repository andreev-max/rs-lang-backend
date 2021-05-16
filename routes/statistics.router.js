const router = require('express').Router();
const authMiddleware = require('../auth.middleware');
const User = require('../models/user.model');
const {
	getLearnedWordsTotal,
	getLearnedWordsToday,
	getLearnedWordsPerDate,
	getCorrectPercentToday,
	getStatsPerGame
} = require('../utils/statsFunctions');

router.post('/statistics', authMiddleware, async (req, res) => {
	try {
		const ID = req.user.userId;
		const game = req.body;

		await User.findOneAndUpdate({ ID }, { $push: { games: game } }, { upsert: true });
		res.status(200).json({ message: 'Статистика обновлена' });
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});


router.get('/statistics', authMiddleware, async (req, res) => {
	try {
		const ID = req.user.userId;
		const game = req.body;

    const user = await Statistics.findOne({ ID });
    let parsedStats = null;
		if (!user.statistics) {
			return res.status(200).json({
				message: 'У вас ещё нет статистики',
				parsedStats
			});
		}
    parsedStats = user.statistics;

		res.status(200).json({ parsedStats, message: 'Статистика обновлена' });
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});

module.exports = router;