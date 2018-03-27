angular.module('weatherApp')
  .controller('mainCtrl', mainCtrl);

function mainCtrl ($http, $scope, $filter) {
  let vm = this;

  vm.pageHeader = {
    title: "Weather App",
    description: "Project for testing geolocation and weather API"
  };

  vm.message = "Checking your location";

  //get weather by city name, standard answer is Kiev
  vm.getWeather = (cityName = 'Kyiv') => {
    $http.get('/api/weather/' + cityName)
      .then((weatherData) => {

        //parse the response data
        const { data: { main: { humidity, pressure, temp },
          name, sys: { country, sunrise, sunset }, weather: [first] } } = weatherData;
        const { description, icon } = first;

        vm.sunrise = $filter('date')(sunrise*1000, 'HH:mm');
        vm.sunset = $filter('date')(sunset*1000, 'HH:mm');
        vm.cityName = `${name}, ${country}`;
        vm.temperature = temp.toFixed() + " °C";
        vm.time = new Date();
        vm.humidity = humidity + '%';
        vm.pressure = (pressure / 1.333224).toFixed() + ' mm Hg';
        vm.cloudness = description;
        vm.weatherIcon = `http://openweathermap.org/img/w/${icon}.png`;

        //create an object to output data to a table with ng-repeat
        vm.weatherInfo = [
          {
            "name": "Cloudiness",
            "value": vm.cloudness
          },
          {
            "name": "Pressure",
            "value": vm.pressure
          },
          {
            "name": "Humidity",
            "value": vm.humidity
          },
          {
            "name": "Sunrise",
            "value": vm.sunrise
          },
          {
            "name": "Sunset",
            "value": vm.sunset
          }
        ];
      })
      .catch((err) => {
        let error = JSON.parse(err.data.error);
        vm.message = `Sorry, ${error.message}`;
        vm.getWeather();
      });
  };

  //get the name of the city by coordinates
  vm.getData = (position) => {
    let lat = position.coords.latitude,
      lng = position.coords.longitude;

    if (lng && lat) {
      $http.get(`/api/weather?lng=${lng}&lat=${lat}`)
        .then((cityData) => {
          vm.message = '';
          vm.getWeather((cityData.data));
        })
        .catch((err) => {
          vm.message = `Sorry, something's gone wrong, ${err.status} ${err.statusText}`;
        })
    } else {
      //output standard response if geolocation data is not received
      vm.message = "Sorry, we did not receive location data";
      vm.getWeather();
    }
  };

  //output the standard response if the user declined the location request
  vm.showError = (err) => {
    $scope.$apply(function () {
      vm.message = err.message;
    });
    vm.getWeather();

  };

  //output the standard response if user's browser does not support geolocation
  vm.noGeo = () => {
    $scope.$apply(function () {
      vm.message = "Geolocation is not supported by this browser.";
    });
    vm.getWeather();
  };

  //get coordinates
  vm.getPosition = (cbSuccess, cbError, cbNoGeo) => {
    if (navigator.geolocation) {
      let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 600000
      };

      navigator.geolocation.getCurrentPosition(cbSuccess, cbError, options);
    } else {
      cbNoGeo();
    }
  };

  vm.getPosition(vm.getData, vm.showError, vm.noGeo);
}