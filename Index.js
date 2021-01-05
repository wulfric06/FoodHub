const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
const { reset } = require('nodemon');
const { dirname } = require('path');
mongoose.connect('mongodb://localhost/FoodHub', { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connections err:'));
db.once('open', function () {
    console.log("Connected to database successfully"); // to check the connection
});

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
    fullname: String,
    username: String,
    email: String,
    tel: String,
    password: String,
    cpassword: String
});

const loginSchema = new mongoose.Schema({
    username: String,
    password: String
});

const commentSchema = new mongoose.Schema({
    name: String,
    dish: String,
    suggestion: String
});

const contactSchema = new mongoose.Schema({
    name: String,
    tel: String,
    email: String,
    address: String,
    subject: String,
    profession: String,
    msg: String
});

const User = mongoose.model('User', userSchema);
const Login = mongoose.model('Login', loginSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Contact = mongoose.model('Contact', contactSchema);

// Express Specific Stuff
app.use('/', express.static(path.join(__dirname + '/static'))) // for serving static files
app.use(express.urlencoded({ extended: true }));

// End Points
app.get('/', (req, res) => {
    var per = db.collection('users')
    res.sendFile('index.html', { root: __dirname + '/static' });
});

app.post('/', (req, res) => {
    let lusername = req.body.username;
    let lpassword = req.body.password;
    // var rusername ;
    // var rpassword ;
    console.log("credentials of user " + lusername + " " + lpassword)
    var person = db.collection('users').find();
    person.forEach(function (doc, err) {
        // console.log(doc.username + " " + doc.password + "  " + doc.tel + " " + doc.email + "'")
        let usern = doc.username
        let pass = doc.password
        let em = doc.email
        if (usern == lusername && pass == lpassword) {
            // rusername  = usern;
            // rpassword = pass;
            // console.log(" from database  in " + rusername + " " + rpassword)

            res.sendFile('home.html', { root: __dirname + '/static' })
        }
        // else if(em == lusername && pass == lpassword){
        //     res.sendFile('home.html', { root: __dirname + '/static' })
        // }
        else {
            res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Failed</title>
        <style>
        h1{
                        text-align: center;
                        font-size: 30px;
                    }
                    p{
                        text-align: center;
                        font-size: 18px;
                    }
                    a{
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <h1>Invalid username or password</h1>
                <p><a href="/">try again...</a></p>
                <p><a href="/signup">or signup first...</a></p>
            </body>
            </html>   
            `)
        }
    })
    // var per = db.collection('users').find({username: req.body.username})
    // console.log(" from database out " + rusername + " " + rpassword)
    // console.log(" from user out " + lusername + " "+ lpassword)

    // res.sendFile('home.html', { root: __dirname + '/static' })
});

app.get('/signup', (req, res) => {
    res.sendFile('signup.html', { root: __dirname + '/static' });
});

app.post('/login', (req, res) => {
    var userData = new User(req.body)
    userData.save().then(() => {
        // res.send("Successfully signed up")
        // res.sendFile('index.html', { root: __dirname + '/static' });
        res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thanks for Registering</title>
    <style>
        h1{
            text-align: center;
            font-size: 30px;
        }
        p{
            text-align: center;
            font-size: 18px;
        }
        a{
            text-decoration: none;
        }
    </style>
</head>
<body>
    <h1>Thanks for Registering</h1>
    <p><a href="/">go to login page...</a></p>
</body>
</html>
        `)
    }).catch(() => {
        res.status(400).send("You are not signed up there is something wrong try again")
    })
});

app.get('/home', (req, res) => {
    res.sendFile('home.html', { root: __dirname + '/static' });
});

app.post('/home', (req, res) => {
    var commentData = new Comment(req.body)
    commentData.save().then(() => {
        // res.sendFile('home.html', { root: __dirname + '/static' });
        res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thanks for Commenting</title>
    <style>
        h1{
            text-align: center;
            font-size: 30px;
        }
        p{
            text-align: center;
            font-size: 18px;
        }
        a{
            text-decoration: none;
        }
    </style>
</head>
<body>
    <h1>Thanks for your <a href="/comments">comment</a> </h1>
    <p><a href="/home">go back to home...</a></p>
</body>
</html>
        `)
    }).catch(() => {
        res.status(400).send("There is something wrong in this comment")
    })
});

app.get('/comments', (req, res) => {
    // res.sendFile('comments.html', { root: __dirname + '/static' });

    var cursor = db.collection('comments').find();
    cursor.forEach(function (doc, err) {
        // resultArr.push(doc);
        // resultArr2.push(doc.suggestion);
        console.log(doc.name + " commented about " + doc.dish + " as: " + "'" + doc.suggestion + "'")
    })
    res.sendFile('comments.html', { root: __dirname + '/static' });

});

app.post('/comments', (req, res) => {
    var commentsData = new Comment(req.body)
    commentsData.save().then(() => {
        res.sendFile('comments.html', { root: __dirname + '/static' });
        // res.send('comment successfull')
    }).catch(() => {
        res.status(400).send("There is something wrong in this comment")
    })
});

app.get('/about', (req, res) => {
    res.sendFile('about.html', { root: __dirname + '/static' });
});

app.get('/services', (req, res) => {
    res.sendFile('services.html', { root: __dirname + '/static' });
});

app.get('/food', (req, res) => {
    res.sendFile('food.html', { root: __dirname + '/static' });
});

app.get('/contact', (req, res) => {
    res.sendFile('contact.html', { root: __dirname + '/static' });
});

app.post('/contact', (req, res) => {
    var contactData = new Contact(req.body)
    contactData.save().then(() => {
        res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thanks for Contacting</title>
    <style>
        h1{
            text-align: center;
            font-size: 30px;
        }
        p{
            text-align: center;
            font-size: 18px;
        }
        a{
            text-decoration: none;
        }
    </style>
</head>
<body>
    <h1>Thanks for Contacting Us</h1>
    <p><a href="/contact">go back...</a></p>
</body>
</html>
        `)
    }).catch(() => {
        res.status(400).send("There is something wrong in this Query try again")
    })
});

// Starting Server
app.listen(80, () => {
    console.log(`Server starting at port 80`);
})