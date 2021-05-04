const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const Token = require('../models/token.model');

const { JWT_SECRET_KEY, JWT_EXPIRE_TIME, JWT_REFRESH_SECRET_KEY, JWT_REFRESH_EXPIRE_TIME } = require('../config');

const refresh = async (userId, tokenId) => {
	const token = await Token.findOne({ userId, tokenId });
	if (!token) {
		return res.status(400).json({ message: 'Не можем найти токен' });
	}
	if (Date.now() > token.expire) {
		return res.status(400).json({ message: 'Токен просрочен' });
	}
	return getTokens(userId);
};

const getTokens = async (userId) => {
	const token = jwt.sign({ id: userId }, JWT_SECRET_KEY, {
		expiresIn: JWT_EXPIRE_TIME
	});

	const tokenId = uuid();
	const refreshToken = jwt.sign({ id: userId, tokenId }, JWT_REFRESH_SECRET_KEY, {
		expiresIn: JWT_REFRESH_EXPIRE_TIME
	});

	const tokenEntity = {
		userId,
		tokenId,
		expire: Date.now() + JWT_REFRESH_EXPIRE_TIME * 1000
	};

	await tokenRepo.upsert({
		userId,
		tokenId,
		expire: Date.now() + JWT_REFRESH_EXPIRE_TIME * 1000
	});
	return { token, refreshToken };
};

const upsert = async (token) =>
	Token.findOneAndUpdate({ userId: token.userId }, { $set: token }, { upsert: true, new: true });

module.exports = { refresh, getTokens, upsert };
