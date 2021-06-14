const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET_KEY } = require('../config');
const { getUserStats } = require('../utils/statsFunctions');
const mailer = require('./nodemailer');
const { getMailerMessage } = require('../utils/getMessage');

router.post('/signup', async (req, res) => {
	try {
		const { email, password, name } = req.body;
		const candidate = await User.findOne({ email });
		if (candidate) {
			return res.status(400).json({
				message: 'Извините, такой email занят :('
			});
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ email, password: hashedPassword, name });
		await user.save();
		mailer(getMailerMessage(email, password, name));
		res
			.status(200)
			.json({
				user,
				message: 'Вы успешно зарегистрировались. Поздравляем! Если вы указали настоящую почту, то проверьте её'
			});
	} catch (e) {
		console.log('signup', e);
		res.status(400).send(e);
	}
});

router.post('/signin', async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'К сожалению, такого пользователя не существует' });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Неправильно введён пароль. Вспоминайте :)' });
		}
		const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: '24h' });
		const parsedStats = getUserStats(user.statistics);
		res.status(200).json({
			token,
			userId: user.id,
			userName: user.name,
			userEmail: user.email,
			avatarURL: user.avatarURL,
			settings: user.settings,
			userWords: user.words,
			statistics: parsedStats,
			message: 'Вы успешно вошли в ваш аккаунт. Мы рады вас видеть :)'
		});
	} catch (e) {
		console.log('signin', e);
		res.status(400).send(e);
	}
});

module.exports = router;
