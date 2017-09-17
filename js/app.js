var app = angular.module('clockCalendarApp', []);

app.controller("DateTimeCtrl", function($scope, $interval) {

    /* function to refresh current date time */
    var refreshTime = function() {
        $scope.now = Date.now();
    }

    /* refresh the date time every second (1000ms) */
    $interval(refreshTime, 1000);

    /* initally call refresh time */
    refreshTime();
});

app.controller("CalendarCtrl", function($scope, $interval) {

    $scope.todayEvents = [{
        'title': 'Today',
        'startDate': Date.now(),
        'endDate': Date.now()
    }, {
        'title': 'Today 2',
        'startDate': Date.now() - 50000000,
        'endDate': Date.now() + 5000000
    }];

    $scope.tomorrowEvents = [{
        'title': 'Tomorrow',
        'startDate': Date.now(),
        'endDate': Date.now()
    }];

    /* function to refresh current date time */
    var refreshTime = function() {
        $scope.now = Date.now();
    }

    /* refresh the date time every second (1000ms) */
    $interval(function() {
        refreshTime();
    }, 1000);

    /* initally call refresh time */
    refreshTime();
});

app.controller("WeatherCtrl", function($scope, $http, $httpParamSerializer, $interval, $log, openweathermap_config) {

    var urlBase = 'http://api.openweathermap.org/data/2.5/';
    var queryString = $httpParamSerializer({
        'id': openweathermap_config.locationID,
        'units': 'metric',
        'appid': openweathermap_config.appid
    });

    var loadWeatherData = function() {

        /* load current weather */
        $http.get(urlBase + 'weather?' + queryString).then(function(response) {
            $scope.weather = response.data;

            /* convert from utc seconds to milliseconds */
            $scope.weather.sys.sunrise *= 1000;
            $scope.weather.sys.sunset *= 1000;

            $log.debug($scope.weather);

        }, function(response) {
            $log.error(response);
        });

        /* load five day forecast */
        $http.get(urlBase + 'forecast/daily?' + queryString).then(function(response) {
            $scope.forecasts = response.data.list;

            $log.debug($scope.forecasts);

        }, function(response) {
            $log.error(response);
        });

    };

    /* initial run */
    loadWeatherData();

    /* reload weather data every ten minutes */
    $interval(loadWeatherData, 10 * 60 * 1000);
});

app.filter('convertToIcon', function() {
    return function(iconCode) {
        var iconMapping = {
            "01d": "wi-day-sunny",
            "02d": "wi-day-cloudy",
            "03d": "wi-cloud",
            "04d": "wi-cloudy",
            "09d": "wi-showers",
            "10d": "wi-rain",
            "11d": "wi-thunderstorm",
            "13d": "wi-snow",
            "50d": "wi-fog",
            "01n": "wi-night-clear",
            "02n": "wi-night-alt-cloudy",
            "03n": "wi-cloud",
            "04n": "wi-cloudy",
            "09n": "wi-showers",
            "10n": "wi-rain",
            "11n": "wi-thunderstorm",
            "13n": "wi-snow",
            "50n": "wi-fog"
        }

        var icon = iconMapping[iconCode];
        return icon != undefined ? icon : iconCode;
    };
});

app.filter('translateWeatherGerman', function() {
    return function(weatherCode) {
        if (weatherCode == undefined) {
            return undefined;
        }

        var weather = weatherCode.toLowerCase();

        var weatherMapping = {
            "clear": "Klar",
            "clear sky": "Klarer Himmel",
            "few clouds": "Wenig bewölkt",
            "shower rain": "Regenschauer",
            "rain": "Regen",
            "thunderstorm": "Gewitter",
            "snow": "Schnee",
            "mist": "Dunst",
            "fog": "Nebel",
            "drizzle": "Nieselregen",
        }

        var weatherTranslation = weatherMapping[weather];
        return weatherTranslation != undefined ? weatherTranslation : weatherCode;
    };
});
