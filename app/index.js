const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

require('dotenv').config();

const app = express();

require('./passport/passport');

if(typeof process.env.SECRET === 'undefined') throw "ENV ERROR: Missing SECRET";
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.set('view engine', 'ejs');

if(typeof process.env.MONGO_URI === 'undefined') throw "ENV ERROR: Missing MONGO_URI";
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'));

app.use('/', require('./routes/main'));
app.use('/dashboard', require('./routes/dashboard'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));