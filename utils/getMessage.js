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

module.exports = {
	getSettingsMessage,
	getStatisticsMessage,
	getUserWordsMessage
};
