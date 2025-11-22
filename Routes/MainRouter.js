// In 'Routes/MainRouter.js'
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('index');
});

router.get('/home', (req, res) => {
    res.render('Main', { currentPath: req.path });
});

router.get('/servicos', (req, res) => {
    res.render('Servicos', { currentPath: req.path });
});

module.exports = router;
