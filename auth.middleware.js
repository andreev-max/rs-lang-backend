const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('./config');

module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}

	try {
		const token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"
		if (!token) {
			return res.status(401).json({ message: 'Пожалуйста, авторизуйтесь /перезайдите' });
		}
		const decoded = jwt.verify(token, JWT_SECRET_KEY);
		req.user = decoded;
		next();
	} catch (e) {
		res.status(401).json({ message: 'Возникла какая-то ошибка с вашим доступом :(' });
	}
};
