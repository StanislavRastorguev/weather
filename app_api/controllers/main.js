const rp = require('request-promise');

let sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

//get city name by coordinates
module.exports.getWeather = (req, res) => {
  let lng = req.query.lng, lat = req.query.lat;
  if (!lng || !lat) {
    sendJsonResponse(req, 404, {
      "message": "data not complete"
    })
  }
  rp(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=en&result_type=locality&key=AIzaSyB6yA5lqBp6n3mfSdasRfVINvI_y29kSRI`)
    .then((cityData) => {
      let parsedData = JSON.parse(cityData);
      //check the status of a response from google
      if (parsedData.status !== "OK") {
        sendJsonResponse(res, 404, {
          "message": "Sorry, wrong status response"
        });
        return;
      }
      let cityName = parsedData.results[0].address_components[0].long_name;
      if (!cityName) {
        sendJsonResponse(res, 404, {
          "message": "Sorry, server is not responding"
        })
      } else {
        sendJsonResponse(res, 200, cityName);
      }
    })
    .catch((err) => {
      sendJsonResponse(res, 404, err);
    });
};

//made a function to get the weather by name, because it returns wrong data by coordinates
module.exports.getWeatherByCityName = (req, res) => {
  let cityName = req.params.city;
  rp(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=37c2f45969dc88a72e155a0ccfae5175`)
    .then((weatherData) => {
      let parsedData = JSON.parse(weatherData);
      if (parsedData.cod !== 200) {
        sendJsonResponse(res, parsedData.cod, parsedData.message);
      } else {
        sendJsonResponse(res, 200, parsedData);
      }
    })
    .catch((err) => {
      sendJsonResponse(res, 404, err);
    });
};