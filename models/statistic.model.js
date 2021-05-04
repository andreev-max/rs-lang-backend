const { Schema, model, Types } = require('mongoose');

const StatisticSchema = new Schema(
  {
    owner: { type: Types.ObjectId, ref: 'User' },
    games: [
      {
        gameName: { type: String },
        totalWords: { type: Number },
        correctPercent: { type: Number },
        longestSeries: { type: Number },
        date: { type: String }
      }
    ]
  },
  { collection: 'statistic' }
);

module.exports = model('Statistic', StatisticSchema);
