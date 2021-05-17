function getTodayDate() {
	const monthArr = [
		'Января',
		'Февраля',
		'Марта',
		'Апреля',
		'Мая',
		'Июня',
		'Июля',
		'Августа',
		'Сентября',
		'Октября',
		'Ноября',
		'Декабря'
	];
	const month = new Date().getUTCMonth();
	const year = new Date().getUTCFullYear();
	const day = new Date().getUTCDate();
	return `${day} ${monthArr[month]} ${year}`;
}

function getStatsPerGame(arr, filterElem, russianName) {
	const initArr = arr;
	const game = filterElem;
	let longestSeries = 0;
	let correctPercent = 0;
	let wordsCount = 0;
	const filteredArray = initArr.filter((item) => item.gameName === game);
	if (filteredArray.length) {
		longestSeries = Math.max.apply(null, filteredArray.map((item) => item.longestSeries));
		correctPercent = Math.round(
			filteredArray.map((elem) => elem.correctPercent).reduce((acc, val) => acc + val) / filteredArray.length
		);
		wordsCount = filteredArray.map((elem) => elem.totalWords).reduce((acc, val) => acc + val);
	}
	return { name: russianName, longestSeries, correctPercent, wordsCount };
}

function getCorrectPercentToday(arr, filterElem) {
	const initArr = arr;
	const date = filterElem;
	let correctPercentToday = 0;
	const filteredArray = initArr.filter((item) => item.date === date);
	if (filteredArray.length) {
		correctPercentToday = Math.round(
			filteredArray.map((item) => item.correctPercent).reduce((acc, val) => acc + val) / filteredArray.length
		);
	}
	return `${correctPercentToday}%`;
}

function getLearnedWordsPerDate(arr) {
	const initArr = arr;
	const dates = [ ...new Set(initArr.map((item) => item.date)) ];

	const allDates = dates.map((elem) => {
		const filteredArr = initArr.filter((game) => game.date === elem);
		return filteredArr;
	});

	const perDate = allDates.map((elem) => {
		const date = elem.map((game) => game.date)[0];
		const words = elem.map((game) => game.totalWords).reduce((acc, val) => acc + val);
		return { date, words };
	});

	return perDate;
}

function getLearnedWordsToday(arr, date) {
	const initArr = arr;
	const todayDate = date;
	let learnedWordsToday = 0;
	const filteredArray = initArr.filter((item) => item.date === todayDate);
	if (filteredArray.length) {
		learnedWordsToday = filteredArray.map((item) => item.totalWords).reduce((acc, val) => acc + val);
	}
	return learnedWordsToday;
}

function getLearnedWordsTotal(data) {
	const amount = data.reduce((acc, value, i) => {
		if (i === 0) {
			acc.push({
				date: value.date,
				words: value.words
			});
		} else if (i > 0) {
			acc.push({
				date: value.date,
				words: value.words + acc[i - 1].words
			});
		}
		return acc;
	}, []);
	return amount;
}

function transformStats({ gameName, correctArr, failArr, seriesArr }) {
	const totalWords = correctArr.length + failArr.length;
	const correctPercent = Math.round(100 * correctArr.length / (correctArr.length + failArr.length));
	const longestSeries = Math.max.apply(null, seriesArr);
	const date = getTodayDate();
	return {
		gameName,
		totalWords,
		correctPercent,
		longestSeries,
		date
	};
}

function getUserStats(allGames) {
  const todayDate = getTodayDate();
  const savannaGameStats = getStatsPerGame(allGames, 'savanna', 'Саванна');
  const matchGameStats = getStatsPerGame(allGames, 'match', 'Отгадай картинку');
  const sprintGameStats = getStatsPerGame(allGames, 'sprint', 'Спринт');
  const audioGameStats = getStatsPerGame(allGames, 'audio', 'Аудиовызов');
  const percentToday = getCorrectPercentToday(allGames, `${todayDate}`);
  const learnedWordsPerDate = getLearnedWordsPerDate(allGames);
  const learnedWordsToday = getLearnedWordsToday(allGames, `${todayDate}`);
  const learnedWordsTotal = getLearnedWordsTotal(learnedWordsPerDate);
  return {
    todayDate,
			learnedWordsTotal,
			learnedWordsToday,
			learnedWordsPerDate,
			percentToday,
			games: [ savannaGameStats, matchGameStats, sprintGameStats, audioGameStats ]
  }
}

module.exports = {
	getUserStats,
	transformStats,
};
