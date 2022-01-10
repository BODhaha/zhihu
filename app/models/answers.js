const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const answerSchema = new Schema({
  __v: { type: Number, select: true },
  content: { type: String, required: true },
  answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: String, required: true},
});

module.exports = model('Answer', answerSchema);