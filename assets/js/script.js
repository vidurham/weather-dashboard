var apiKey = "&appid=a35536613023136e4915b74f3f80575a"
var inputEl = document.querySelector("#city-input")
var searchButtonEl = document.querySelector("#search-button")
var historyEl = document.querySelector("#history")
var currentCityEl = document.querySelector("#current-city")
var weatherPicEl = document.querySelector("#weather-pic")
var temperatureEl = document.querySelector("#current-temp")
var humidityEl = document.querySelector("#current-humidity")
var windEl = document.querySelector("#wind-speed")
var indexEl = document.querySelector("#uv-index")
var cardEl = document.querySelector(".card-container")
var fiveDayEl = document.querySelector("#five-day")
var backgroundEl = document.querySelector(".city-info")
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
                    saveCity()
            });
        })   
}

function findWeather2(city) {
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
    temperatureEl.innerHTML = ("Temperature: " + cityWeatherTemp + "°F");
    
    var cityWeatherHumidity = cityWeather.main.humidity;
    humidityEl.innerHTML = ("Humidity: " + cityWeatherHumidity + "%");

    var cityWeatherWind = cityWeather.wind.speed;
    windEl.innerHTML = ("Wind Speed: " + cityWeatherWind + "mph");

    var cityWeatherPic = cityWeather.weather[0].icon
    weatherPicEl.setAttribute("src", "https://openweathermap.org/img/w/" + cityWeatherPic + ".png")
    getBackground(cityWeatherPic)
}

var getIndex = function(uv) {
    var uvIndex = uv.current.uvi
    indexEl.innerHTML = "UV Index: " + uvIndex
}

var future = function(futureWeather) {
    cardEl.innerHTML = "";
    fiveDayEl.innerHTML = "";
    fiveDayEl.innerHTML = "5-Day Forecast"
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
        card.classList.add("col-md-2")

        cardEl.append(card);
        
    }

    
}

var saveCity = function() {
    var city = inputEl.value;
    if (city === null) {
        alert("No city entered")
    }
    else {
        var savedCities = localStorage.getItem("savedCities");
        if (savedCities === null) {
            savedCities = [];
        }
        else {
            savedCities = JSON.parse(savedCities);
        }
        savedCities.push(city);
        var newCity = JSON.stringify(savedCities);
        localStorage.setItem("savedCities", newCity)
        searchHistory()
    }
}

var searchHistory = function() {
    var cityEl = document.createElement("li");
    cityEl.innerHTML = inputEl.value;
    historyEl.append(cityEl)
}

var clickHandler = function(event) {
    var clickCity = event.target.textContent;
    findWeather2(clickCity)   
}

var getBackground = function(background) {
    backgroundEl.classList.remove("clear", "light-cloud", "cloudy", "rainy", "thunder", "snowy", "mist", "text-light")
    if (background === "01d" || background === "01n") {
        backgroundEl.classList.add("clear")
    }
    else if (background === "02d" || background === "02n") {
        backgroundEl.classList.add("light-cloud")
    }
    else if (background === "03d" || background === "03n" || background === "04d" || background === "04n") {
        backgroundEl.classList.add("cloudy")
    }
    else if (background === "09d" || background === "09n" || background === "10d" || background === "10n") {
        backgroundEl.classList.add("rainy")
        backgroundEl.classList.add("text-light")
    }
    else if (background === "11d" || background === "11n") {
        backgroundEl.classList.add("thunder")
    }
    else if (background === "13d" || background === "13n") {
        backgroundEl.classList.add("snowy")
    }
    else if (background === "50d" || background === "50n") {
        backgroundEl.classList.add("mist")
        backgroundEl.classList.add("text-light")
    }
    
}

searchButtonEl.addEventListener("click", findWeather)
historyEl.addEventListener("click", clickHandler)



