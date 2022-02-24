var apiKey = "&appid=a35536613023136e4915b74f3f80575a"
var inputEl = document.querySelector("#city-input")
var searchButtonEl = document.querySelector("#search-button")
var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q="

function dos() {
    var city = inputEl.value;
    console.log(queryUrl + city + apiKey)
    
}

searchButtonEl.addEventListener("click", dos)


