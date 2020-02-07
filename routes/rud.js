const express = require('express');
const router = express.Router();
const q = require('../database/quiz');
const cat = require('../database/credentials');
// const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// const cat = new c();
router.post('/questions/add',async(req,res)=>{
    console.log(req.body);
    const person = await cat.find({email:req.body.username})
        .select({clearance:1});
    console.log(person);
    if(!person){
        res.status(404).send('Incorrect username')
        res.redirect('/api/quiz');
    }
    // console.log(clearance);
    if(person[0].clearance != 'Admin'){
        res.status(500).send('Only admins are allowed to add questions');
        // res.redirect('/api/quiz');
    }
    const question = new q({
        id: req.body.id,
        question: req.body.question,
        answerA: req.body.answerA,
        isAnswered: false
    });
    const result = await question.save();
    res.send(result);
});


router.get('/questions/no',async (req,res)=>{
    const questions = await q.find()
        .sort({id: 1})
        .select({id: 1});
    res.send(questions);
})


router.put('/answer/:id',async (req,res)=>{
    let r;
    const person = await cat.find({email:req.body.username})
        .select({result:1,_id:1});
    console.log(person);
    const _result = person[0].result;
    if(req.user != person._id){
        res.status(500).send('Login again');
        res.redirect('/api/quiz');
    }
    const question = await q.findOneAndUpdate({id:parseInt(req.params.id)},{answerU:req.body.answerU});
    const question_1 = await q.findOneAndUpdate({id:parseInt(req.params.id)},{isAnswered:true});
    console.log(question_1);
    // let info = result(question, c, person.email, _result);
    if((question.answerA.localeCompare(question.answerU,{sensitivity:'base'}))){
        r = await cat.findOneAndUpdate({email:req.body.username},{result: _result+1});
        console.log(r);
    }
    let transport = nodemailer.createTransport({
        host:'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'nelda53@ethereal.email',
            pass: 'qY5jGPfsh6XvKB2yEg'
        }
    });
    let info = await transport.sendMail({
        from: 'nelda53@ethereal.email',
        to: req.body.username,
        subject: 'Result uptill Now',
        html: "<p>Result:"+r.result+"</p>"
    });
    res.write("<p>Answer: "+question_1.answerU+"</p><br>");
    res.write(nodemailer.getTestMessageUrl(info));
    res.end();
})

module.exports = router;