const mongoose = require('mongoose');
var conn = mongoose.createConnection('mongodb://localhost/quiz');


const quizSchema = new mongoose.Schema({
    id: Number,
    question: String,
    answerA: {
        type: String,
        required: true,
        default: null
    },
    answerU: {
        type: String,
        required: false,
        default: null
    },
    isAnswered: Boolean
});
// const Quiz = conn.model('Quiz', quizSchema);

module.exports = conn.model('Quiz', quizSchema);