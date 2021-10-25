const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser')

require('dotenv').config();
app.use(express.static(__dirname + '/'));

app.use(express.urlencoded({
    urlencoded: true
}))

// CORS Configuration

const allowedDomains = ["http://localhost", "ionic://localhost", "http://localhost:8100"];
app.options('*', cors({
    origin: allowedDomains,
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(function (req, res, next) {
    const origin = req.headers.origin;
    if (allowedDomains.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Accept,Accept-Language,Content-Type,Depth,User-Agent,X-File-Size,X-Requested-With,If-Modified-Since,X-File-Name,Cache-Control,Set-Cookie');
    next();
});

app.use(cookieParser());

//routing
const v1 = require('./data/routing/routes');
app.use('/api', v1)

app.get('/', (req, res) => {
    res.send({ message: "Hellowcart app is running app is runing" })
});

module.exports = app;