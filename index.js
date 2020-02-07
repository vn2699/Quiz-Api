const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const Credentials = require('./database/credentials');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const default_3 = require('./routes/default');
const rud = require('./routes/rud');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


// mongoose.connect('mongodb://localhost/quiz')
//     .then(()=> console.log('Connected to MongoDB'))
//     .catch((err)=> console.error('Error in connecting to MongoDB',err));


// var token = jwt.sign({clearance: 'user'},'secret@12',{algorithm: "HS256"});
// jwt.verify(token,'secret@12',(err,res)=>{
//     console.log(res.clearance);
// })
// var decode = jwt.decode(token);
// console.log(decode.clearance);
// app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge:null
    }
}))
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine','pug');
app.set('views','./view');
app.use('/api/quiz',default_3);
app.use('/api/quiz', rud)
let secret = process.env.App_password || 'secret@12';
let rand;




// async function createCredentials(){
//     const password1 = bcrypt.hashSync('varunrahul',10);
//     const password2 = bcrypt.hashSync('rahulvarun',10);
//     const person_1 = new Credentials({
//         email: 'vn2699@gmail.com',
//         password: password1,
//         clearance: 'user'
//     });
//     const person_2 = new Credentials({
//         email: 'ran2008@gmail.com',
//         password: password2,
//         clearance: 'admin'
//     });
//     const result = await person_1.save();
//     const result_2 = await person_2.save();
//     console.log(result,result_2);
// }

// createCredentials();
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    (username, password, done)=>{
        Credentials.findOne({email: username},function(err, user){
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, {message: 'Incorrect username'});
            }
            if(!bcrypt.compareSync(password, user.password)){
                return done(null, false, {message: 'Incorrect password'});
            }
            return done(null, user);
        })
    }
))
app.get('/api/quiz/',(req,res)=>{
    // res.sendFile('auth.html', { root : __dirname})
    res.render('index');
});
app.get('/api/quiz/error', (req, res) => res.send("Register yourself..."));


app.post('/api/quiz/register',async (req,res) =>{
    // console.log(req.body);
    // let password1 = req.body.password;
    // console.log(password1);
    let password = bcrypt.hashSync(req.body.password, saltRounds=10);
    const person = new Credentials({
        email: req.body.username,
        password: password,
        clearance: req.body.clearance
    })
    // let payload = {
    //     email: req.body.username,
    //     password: password,
    //     clearance: req.body.clearance
    // }
    const result = await person.save();
    console.log(result);
    // const token = jwt.sign(payload,secret,{algorithm:'HS256'}, function(token,err){
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         return token;
    //     }
    // });
    // console.log(parseInt(token));
    rand=Math.floor((Math.random() * 100) + 54);
    let link = "http://localhost:3000/api/quiz/verify/?id="+rand;
    // let info = mail(link,req.body.username);
    let transport = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth:{
            user: 'nelda53@ethereal.email',
            pass: 'qY5jGPfsh6XvKB2yEg'
        }
    });

    let info = await transport.sendMail({
        from: 'nelda53@ethereal.email',
        to: req.body.username,
        subject: 'Verfiy',
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    });
    res.send(nodemailer.getTestMessageUrl(info));
    
});


app.get('/api/quiz/verify',(req,res)=>{
    // jwt.verify(req.query.id, secret, (err,result)=>{
    //     if(err){
    //         console.error('Error Occured',err);
    //     }
    //     else{
    //         res.write(`<p>User: ${result.email}</p>`);
    //         res.send('Verified');
    //     }
    // })
    if(req.query.id==rand)
    {
        console.log("email is verified");
        res.end("<h1>Email has been Successfully verified");
    }
    else
    {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
    }
})


app.post('/api/quiz',
  passport.authenticate('local', { failureRedirect: '/api/quiz/error' }),
  function(req, res) {
    res.redirect('/api/quiz/questions');
  });


passport.serializeUser(function(user, done) {
    console.log(user.id);
    done(null, user.id);
  });

  
passport.deserializeUser(function(id, done) {
    Credentials.findById(id, function(err, user) {
        done(err, user);
    });
});



const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Listening on port: ${port}...`);
});

