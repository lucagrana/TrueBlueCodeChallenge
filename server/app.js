const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');

const listRoutes = require('./api/routes/list');

mongoose.connect(
    'mongodb+srv://dbUserTB:' + 
    'trueblue' +  
    '@trueblue-codechallenge.g70j4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// For prevent CORS error
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
     'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});

// Route for handling requests
app.use('/list', listRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
   });
