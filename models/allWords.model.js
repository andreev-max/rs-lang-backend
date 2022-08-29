const { Schema, model } = require('mongoose');

const AllWordsSchema = new Schema(
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
	},
	{ collection: 'all-words' }
);

module.exports = model('AllWords', AllWordsSchema);
