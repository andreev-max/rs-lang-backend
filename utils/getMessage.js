const { MAILER_USER } = require('../config');

function getSettingsMessage(settingName, value) {
	console.log(settingName);
	console.log(value);
	let message = '';
	if (settingName === 'difficultWord') {
		message =
			value === false
				? 'Иконка для добавления слова в раздел "Сложные слова" отсутствует'
				: 'Иконка для добавления слова в раздел "Сложные слова" присутствует';
	} else if (settingName === 'deleteWord') {
		message = value === false ? 'Иконка для удаления слова отсутствует' : 'Иконка для удаления слова присутствует';
	} else if (settingName === 'translateWord') {
		message = value === false ? 'Перевод слова отсутствует' : 'Перевод слова присутствует';
	} else if (settingName === 'translateSentences') {
		message = value === false ? 'Перевод предложений отсутствует' : 'Перевод предложений присутствует';
	} else if (settingName === 'musicVolume') {
		message = `Изменили громкость музыки на ${value}`;
	} else if (settingName === 'soundVolume') {
		message = `Изменили громкость звуков на ${value}`;
	} else if (settingName === 'wordVolume') {
		message = `Изменили громкость воспроизведения слов на ${value}`;
	} else if (settingName === 'theme') {
		message = value === 'dark' ? 'Вы выбрали тёмную тему. Отличный выбор' : 'Вы выбрали светлую тему. Хороший выбор';
	}

	return message;
}

function getStatisticsMessage(count) {
	const number = +count;
	let message;
	switch (number) {
		case 0:
			message = 'Ваша статистика обновлена, но все слова из игры у вас уже есть';
			break;
		case 1:
			message = `${number} новое слово уже в вашем словаре. Ваша статистика также обновлена`;
			break;
		case 2:
		case 3:
		case 4:
			message = `${number} новых слова уже в вашем словаре. Ваша статистика обновлена`;
			break;
		default:
			message = `${number} новых слов уже в вашем словаре. Ваша статистика обновлена`;
			break;
	}
	return message;
}

function getUserWordsMessage(name, value, wordName) {
	let message;
	if (name === 'difficult') {
		message =
			value === true
				? `Добавили слово ${wordName} в раздел "Сложные слова"`
				: `Убрали слово ${wordName} из раздела "Сложные слова"`;
	} else if (name === 'deleted') {
		message =
			value === true
				? `Удалили слово ${wordName}. Оно не будет попадаться вам ни в словаре, ни в книге, ни в играх. (Можно восстановить в разделе "Удалённые слова")`
				: `Дали второй шанс слову ${wordName}`;
	}
	return message;
}

function getMailerMessage(email, password, name) {
	return {
		from: `RS Lang <${MAILER_USER}>`,
		to: email,
		subject: 'Поздравляем! Вы успешно зарегистрировались в приложении RS Lang',
		html: `
		<h2>Мы очень рады, что вы выбрали именно наше приложение для изучения английского языка. Надеемся, что мы вас не разочаруем. Если вдруг вы найдёте какие-нибудь ошибки, то вы всегда можете написать нам по этому адресу ${MAILER_USER} . Или заполнить форму в самом приложении во вкладке "Настройки".</h2>
		<br />
		<h4>Мы оставим здесь ваши данные, которые вы указали при регистрации. Так у вас всегда будет возможность подсмотреть их, если вдруг забудете :)</h4>
		<ul>
		<li>Ваш Логин: ${email}</li>
		<li>Ваш Пароль: ${password}</li>
		<li>Ваш Никнейм: ${name} (можно в любой момент изменить во вкладке "Настройки")</li>
		</ul>
		<p> P.S. Это письмо не требует обязательного ответа</p>
																									 <h5>С уважением, команда RS Lang :)</h5>
		`
	};
}

module.exports = {
	getSettingsMessage,
	getStatisticsMessage,
	getUserWordsMessage,
	getMailerMessage
};
