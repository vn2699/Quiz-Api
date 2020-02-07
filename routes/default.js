const express = require('express');
const router = express.Router();
const Quiz = require('../database/quiz');
// const passport = require('passport');



// async function createQuestions(){
//     const question = new Quiz({
//         id: 1,
//         question: 'Which company takes it\'s new joinie\'s to the Hakone Gardens?',
//         answerA: 'Facebook and twitter',
//         isAnswered: false
//     });
//     const question_2 = new Quiz({
//         id: 2,
//         question: 'Which bands are considered as the creators of Rock?',
//         answerA: 'Led Zepplin, Black Sabbath and Deep Purple',
//         isAnswered: false
//     })
//     const question_3 = new Quiz({
//         id: 3,
//         question: 'Name 2 members from the 27 club?',
//         answerA: 'Jim Morison and Janis Joplin',
//         isAnswered: false
//     })
//     const result = question.save();
//     const result_2 = question_2.save();
//     const result_3 = question_3.save();
// }
// createQuestions();

router.get('/questions',async (req,res)=>{
    const questions = await Quiz.find()
        .limit(10)
        .sort({question: 1})
        .select({question: 1, isAnswered: 1});
    // const html='';
    // result.forEach((r)=>{
    //     html += `<p>
    //                 <h4>${r.question}</h4>
    //                 <li>${r.isAnswered}</li>
    //             <p>`
    // })
    res.send(questions);
})

module.exports = router;