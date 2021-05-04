const { Schema, model, Types } = require('mongoose');

const Token = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'Users' },
    tokenId: { type: String, required: true },
    expire: { type: Number, required: true }
  },
  { collection: 'tokens' }
);

module.exports = model('tokens', Token);
