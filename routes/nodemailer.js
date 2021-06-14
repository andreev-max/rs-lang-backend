const nodemailer = require('nodemailer');
const { MAILER_PASS, MAILER_USER } = require('../config');
const transporter = nodemailer.createTransport({
	host: 'smtp.mail.ru',
	port: 465,
	auth: {
		user: MAILER_USER,
		pass: MAILER_PASS
	},
	tls: {
		rejectUnauthorized: false
	}
});

transporter.verify((error, success) => {
	error ? console.log(error) : console.log('Server ready to take our messages:', success);
});

const mailer = async (message) => {
	transporter.sendMail(message, (err, info) => {
		if (err) {
			console.log('Email Error', err);
			return err;
		} else {
			console.log('Email info:', info);
			return info;
		}
	});
};

module.exports = mailer;
