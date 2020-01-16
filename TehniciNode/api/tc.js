const express = require('express')
const path = require('path')
const app = express();

const root = path.join(__dirname, '../static')
const router = new express.Router()

router.get('/tc', (req, res) => {
    res.sendFile('./pages/tc.html', {
        root
    })
});


router.get('/', (req, res) => {
    res.sendFile('./pages/login.html', {
        root
    })
});

router.get('/register', (req, res) => {
    res.sendFile('./pages/register.html', {
        root
    })
});

module.exports = router

