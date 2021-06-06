const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET_KEY } = require('../config');
const { getUserStats } = require('../utils/statsFunctions');

router.post(
	'/signup',
	[
		check('email', 'Неправильно введён email').isEmail(),
		check('password', 'Пароль должен содержать от 4 до 12 символов').isLength({
			min: 4,
			max: 12
		})
	],
	async (req, res) => {
		console.log(req.body);
		try {
			const errors = validationResult(req);
			console.log(errors);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Некорректно введены данные, попробуйте снова'
				});
			}

			const { email, password, name } = req.body;

			const candidate = await User.findOne({ email });
			console.log(candidate);
			if (candidate) {
				return res.status(400).json({
					message: 'Извините, такой email занят :('
				});
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const user = new User({ email, password: hashedPassword, name });

			await user.save();
			res.status(200).json({ user, message: 'Вы успешно зарегистрировались' });
		} catch (e) {
			console.log('signup', e);
			res.status(400).send(e);
		}
	}
);

router.post(
	'/signin',
	[
		check('email', 'Пожалуйста, введите корректно свой email').normalizeEmail().isEmail(),
		check('password', 'Вы не ввели пароль').exists()
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Некорректно введены данные'
				});
			}

			const { email, password } = req.body;

			const user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ message: 'Такого пользователя не существует' });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ message: 'Неправильно введён пароль' });
			}

			const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: '24h' });

			const parsedStats = getUserStats(user.statistics);

			res.status(200).json({
				token,
				userId: user.id,
				userName: user.name,
				avatarURL: user.avatarURL,
				settings: user.settings,
				userWords: user.words,
				statistics: parsedStats,
				message: 'Вы успешно вошли в ваш аккаунт'
			});
		} catch (e) {
			console.log('signin', e);
			res.status(400).send(e);
		}
	}
);

module.exports = router;
