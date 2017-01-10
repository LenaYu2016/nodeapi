var express = require('express');
var router = express.Router();

router.get('/get', function(req, res, next) {
    res.render('weather');
});

module.exports = router;