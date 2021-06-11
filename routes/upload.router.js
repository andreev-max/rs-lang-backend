const router = require('express').Router();
const User = require('../models/user.model');
const auth = require('../auth.middleware');
const cloudinary = require('cloudinary').v2;
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require('../config');

cloudinary.config({
	cloud_name: CLOUDINARY_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET
});

router.post('/upload', auth, async function(req, res) {
	const ID = req.user.userId;
	try {
		const result = await cloudinary.uploader.upload(req.files.avatar.tempFilePath, { upload_preset: 'avatarPreset' });
		const user = await User.findByIdAndUpdate(ID, { avatarURL: result.url, new: true });
		const avatarURL = result.url || user.avatarURL;
		res.status(200).json({ avatarURL, message: 'Загрузили новое фото. Вы тут просто красавчик :)' });
	} catch (e) {
		console.log(e);
		res.send(e);
	}
});

module.exports = router;
