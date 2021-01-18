var cities = [];

var cityFormElement = document.querySelector("#city-search-form");
var cityInputElement = document.querySelector("#city");
var weatherContainerElement = document.querySelector("#current-weather-container");
var citySearchInputElement = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerElement = document.querySelector("#fiveday-container");
var pastSearchButtonElement = document.querySelector("#past-search-buttons");

var formSumbitHandler = function(event) {
	event.preventDefault();
	var city = cityInputElement.value.trim();
	if (city) {
		getCityWeather(city);
		get5DayForecast(city);
		cities.unshift({
			city
		});
		cityInputElement.value = "";
	} else {
		alert("Please enter a city!");
	}
	saveSearch();
	pastSearch(city);
}

var saveSearch = function() {
	localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(city) {
	var apiKey = "06407866ad30b31829fe355fcd7edf9b"
	var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

	fetch(apiURL)
		.then(function(response) {
			response.json().then(function(data) {
				displayWeather(data, city);
			});
		});
};

var displayWeather = function(weather, searchCity) {
	weatherContainerElement.textContent = "";
	citySearchInputElement.textContent = searchCity;

	var currentDate = document.createElement("span")
	currentDate.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
	citySearchInputElement.appendChild(currentDate);

	var weatherIcon = document.createElement("img")
	weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
	citySearchInputElement.appendChild(weatherIcon);

	var temperatureElement = document.createElement("span");
	temperatureElement.textContent = "Temperature: " + weather.main.temp + " °F";
	temperatureElement.classList = "list-group-item"

	var humidityElement = document.createElement("span");
	humidityElement.textContent = "Humidity: " + weather.main.humidity + " %";
	humidityElement.classList = "list-group-item"

	var windSpeedElement = document.createElement("span");
	windSpeedElement.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
	windSpeedElement.classList = "list-group-item"

	weatherContainerElement.appendChild(temperatureElement);

	weatherContainerElement.appendChild(humidityElement);

	weatherContainerElement.appendChild(windSpeedElement);

	var latitude = weather.coord.latitude;
	var longitude = weather.coord.longitude;
	getUvIndex(latitude, longitude)
}

var getUvIndex = function(latitude, longitude) {
	var apiKey = "844421298d794574c100e3409cee0499"
	var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&latitude=${latitude}&longitude=${longitude}`
	fetch(apiURL)
		.then(function(response) {
			response.json().then(function(data) {
				displayUvIndex(data)
			});
		});
}

var displayUvIndex = function(index) {
	var uvIndexElement = document.createElement("div");
	uvIndexElement.textContent = "UV Index: "
	uvIndexElement.classList = "list-group-item"

	uvIndexValue = document.createElement("span")
	uvIndexValue.textContent = index.value

	if (index.value <= 2) {
		uvIndexValue.classList = "favorable"
	} else if (index.value > 2 && index.value <= 8) {
		uvIndexValue.classList = "moderate "
	} else if (index.value > 8) {
		uvIndexValue.classList = "severe"
	};

    uvIndexElement.appendChild(uvIndexValue);
    
	weatherContainerElement.appendChild(uvIndexElement);
}

var get5DayForecast = function(city) {
	var apiKey = "844421298d794574c100e3409cee0499"
	var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

	fetch(apiURL)
		.then(function(response) {
			response.json().then(function(data) {
				display5Day(data);
			});
		});
};

var display5Day = function(weather) {
	forecastContainerElement.textContent = ""
	forecastTitle.textContent = "5-Day Forecast:";

	var forecast = weather.list;
	for (var i = 5; i < forecast.length; i = i + 8) {
		var dailyForecast = forecast[i];


		var forecastElement = document.createElement("div");
		forecastElement.classList = "card bg-primary text-light m-2";

		var forecastDate = document.createElement("h5")
		forecastDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
		forecastDate.classList = "card-header text-center"
		forecastElement.appendChild(forecastDate);

		var weatherIcon = document.createElement("img")
		weatherIcon.classList = "card-body text-center";
		weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

		forecastElement.appendChild(weatherIcon);

		var forecastTempEl = document.createElement("span");
		forecastTempEl.classList = "card-body text-center";
		forecastTempEl.textContent = dailyForecast.main.temp + " °F";

		forecastElement.appendChild(forecastTempEl);

		var forecastHumidityElement = document.createElement("span");
		forecastHumidityElement.classList = "card-body text-center";
		forecastHumidityElement.textContent = dailyForecast.main.humidity + "  %";

		forecastElement.appendChild(forecastHumidityElement);

		forecastContainerElement.appendChild(forecastElement);
	}

}

var pastSearch = function(pastSearch) {

	pastSearchElement = document.createElement("button");
	pastSearchElement.textContent = pastSearch;
	pastSearchElement.classList = "p-3 m-1 btn btn-light btn-block";
	pastSearchElement.setAttribute("data-city", pastSearch)
	pastSearchElement.setAttribute("type", "submit");

	pastSearchButtonElement.prepend(pastSearchElement);
}


var pastSearchHandler = function(event) {
	var city = event.target.getAttribute("data-city")
	if (city) {
		getCityWeather(city);
		get5DayForecast(city);
	}
}

cityFormElement.addEventListener("submit", formSumbitHandler);
pastSearchButtonElement.addEventListener("click", pastSearchHandler);