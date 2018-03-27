const express = require('express');
const router = express.Router();
const ctrlMain = require('../controllers/main');

router.get('/weather', ctrlMain.getWeather);
router.get('/weather/:city', ctrlMain.getWeatherByCityName);

module.exports = router;
