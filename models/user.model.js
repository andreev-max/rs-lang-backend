const { Schema, model } = require('mongoose');

const User = new Schema(
	{
		name: { type: String, Default: 'Unregistered raccoon' },
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		avatarURL: {
			type: String,
			default: 'http://res.cloudinary.com/nazdac/image/upload/v1616652013/travelAppFolder/dmlfcuvyr79gpkbgg639.jpg'
		},
		settings: {
			soundVolume: { type: Number, default: 0 },
			musicVolume: { type: Number, default: 0 },
			wordVolume: { type: Number, default: 50 },
			difficultWord: { type: Boolean, default: true },
			deleteWord: { type: Boolean, default: true },
			translateWord: { type: Boolean, default: true },
			translateSentences: { type: Boolean, default: true },
			theme: { type: String, default: 'light' }
		},
		statistics: [
			{
				gameName: { type: String },
				totalWords: { type: Number },
				correctPercent: { type: Number },
				longestSeries: { type: Number },
				date: { type: String }
			}
		],
		words: [
			{
				group: { type: Number },
				page: { type: Number },
				word: { type: String },
				wordTranslate: { type: String },
				transcription: { type: String },
				image: { type: String },
				audio: { type: String },
				audioMeaning: { type: String },
				audioExample: { type: String },
				textMeaning: { type: String },
				textMeaningTranslate: { type: String },
				textExample: { type: String },
				textExampleTranslate: { type: String },
				difficult: { type: Boolean, default: false },
				deleted: { type: Boolean, default: false },
				correct: { type: Number, default: 0 },
				fail: { type: Number, default: 0 }
			}
		]
	},
	{ collection: 'users' }
);

module.exports = model('Users', User);
