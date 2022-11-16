const express = require('express');
const mongoose = require('mongoose');

const app = express();

require('dotenv').config();

app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.set('view engine', 'ejs');

if(typeof process.env.MONGO_URI === 'undefined') throw "ENV ERROR: Missing MONGO_URI";

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));