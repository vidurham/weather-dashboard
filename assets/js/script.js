var apiKey = "&appid=a35536613023136e4915b74f3f80575a"
var inputEl = document.querySelector("#city-input")
var searchButtonEl = document.querySelector("#search-button")
var currentCityEl = document.querySelector("#current-city")
var weatherPicEl = document.querySelector("#weather-pic")
var temperatureEl = document.querySelector("#current-temp")
var humidityEl = document.querySelector("#current-humidity")
var windEl = document.querySelector("#wind-speed")
var indexEl = document.querySelector("#uv-index")
var cardEl = document.querySelector(".card-container")
var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q="

function findWeather() {
    var city = inputEl.value;
    var url = queryUrl + city + apiKey;
    
    fetch(url)
        .then(function(response) {
            if (response.ok)
                response.json().then(function(data) {
                    getWeather(data)
                    useOneCall(data)
            });
        })   
}

var useOneCall = function (cityData) {
    var cityLat = cityData.coord.lat
    var cityLon = cityData.coord.lon
    var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=alerts,minutely,hourly" + apiKey
    fetch(oneCall)
        .then(function(response) {
            if (response.ok)
                response.json().then(function(data) {
                    getIndex(data)
                    console.log(data)
                    future(data)
            });
        })   
}

var getWeather = function(cityWeather) {
    var cityName = cityWeather.name;
    currentCityEl.innerHTML = cityName;

    var cityWeatherTemp = Math.round(((cityWeather.main.temp - 273.15)*1.8) + 32);
    temperatureEl.innerHTML = (cityWeatherTemp + "°F");
    
    var cityWeatherHumidity = cityWeather.main.humidity;
    humidityEl.innerHTML = (cityWeatherHumidity + "%");

    var cityWeatherWind = cityWeather.wind.speed;
    windEl.innerHTML = (cityWeatherWind + "mph");

    var cityWeatherPic = cityWeather.weather[0].icon
    weatherPicEl.setAttribute("src", "https://openweathermap.org/img/w/" + cityWeatherPic + ".png")

}

var getIndex = function(uv) {
    var uvIndex = uv.current.uvi
    indexEl.innerHTML = uvIndex
}

var future = function(futureWeather) {
    for (var i = 1; i < 6; i++) {
        var card = document.createElement("div")
        
        var dateEl = document.createElement("h4");
        var milliseconds = futureWeather.daily[i].dt * 1000;
        var dateObject = new Date(milliseconds);
        var getDate = dateObject.toLocaleString("en-US", {month: "numeric", day: "numeric", year: "numeric"})
        dateEl.append(getDate)

        var forecastImg = document.createElement("img");
        forecastImg.setAttribute("src", "https://openweathermap.org/img/w/" + futureWeather.daily[i].weather[0].icon + ".png");
        
        var forecastTempEl = document.createElement("p");
        var forecastTemp = ("Temp: " + Math.round(((futureWeather.daily[i].temp.max - 273.15)*1.8) + 32) + "°F");
        forecastTempEl.append(forecastTemp);

        var forecastWindEl = document.createElement("p");
        var forecastWind = ("Wind: " + futureWeather.daily[i].wind_speed + "mph");
        forecastWindEl.append(forecastWind);

        var forecastHumidityEl = document.createElement("p");
        var forecastHumidity = ("Humidity: " + futureWeather.daily[i].humidity + "%");
        forecastHumidityEl.append(forecastHumidity);

        card.append(dateEl);
        card.append(forecastImg);
        card.append(forecastTempEl);
        card.append(forecastWindEl);
        card.append(forecastHumidityEl);

        card.classList.add("cards")
        card.classList.add("col-md-3")

        cardEl.append(card);
        
    }

    
}

searchButtonEl.addEventListener("click", findWeather)


