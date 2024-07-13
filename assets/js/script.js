const apiKey = "4d7d3cb5e13c068905d2bbbfc8010412";
/* 
Get current weather data from Open Weather Map for the city input by user
*/
const fetchCurrentWeather = (searchInputVal) => {

    return new Promise((resolve, reject) => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${searchInputVal}&appid=${apiKey}`)
        .then((response) => {
            console.log(response);
            response.json()
            .then((currentJson) => {
                console.log("received current weather response");
                resolve(currentJson);
            })
        })
        .catch((error) => {
            console.log("failed to grab current weather with error");
            console.log(error);
            reject(error);
        })
    })
}

const fetchForecast = (searchInputVal) => {
    
    return new Promise((resolve, reject) => {
        fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${searchInputVal}&appid=${apiKey}`)
        .then((response) => {
            console.log(response);
            response.json()
            .then((forecastJson) => {
                console.log("received forecast weather response");
                resolve(forecastJson);
            })
        })
        .catch((error) => {
            console.log("failed to grab forecase weather with error");
            console.log(error);
            reject(error);
        })
    })
}

/*
render current weather results to page
*/
const renderCurrentWeather = (currentJson, searchInputVal) => {
    console.log(currentJson);
    
    wipeCurrentWeather();
    
    let ts = new Date();

    const todayWeatherDiv = document.querySelector("#today-weather");
    const nameDateH2 = document.createElement('h2');
    const tempEl = document.createElement('p');
    const windEl = document.createElement('p');
    const humidityEl = document.createElement('p');

    nameDateH2.textContent = searchInputVal + ts.toLocaleDateString();
    tempEl.textContent = `Temp: ${currentJson.main.temp}&deg;F`;
    windEl.textContent = `Wind: ${currentJson.wind.speed} MPH`;
    humidityEl.textContent = `Humidity: ${currentJson.main.humidity}%`;

    nameDateH2.setAttribute(
        'style',
        'color: var(--mainText); font-weight: 700; font-size: 22px; margin-bottom: 10px;'
    )

    tempEl.setAttribute(
        'style',
        'color: var(--mainText); margin-bottom: 10px'
    )

    windEl.setAttribute(
        'style',
        'color: var(--mainText); margin-bottom: 10px'
    )

    humidityEl.setAttribute(
        'style',
        'color: var(--mainText); margin-bottom: 10px'
    )

    todayWeatherDiv.append(nameDateH2, tempEl, windEl, humidityEl);
}

/*
render forecast weather results to page
*/
const renderForecastWeather = (forecastJson) => {
    console.log(forecastJson);
    
    wipeForecastWeather();
    
    for (i=0; i<5; i++) {
        const date = forecastJson[i].dt.toLocaleDateString;
        const temp = forecastJson[i].main.temp;
        const wind = forecastJson[i].wind.speed;
        const humidity = forecastJson[i].main.humidity;

        const forecastDay = {
            date: date,
            temp: `Temp: ${temp}&deg;F`,
            wind: `Wind: ${wind} MPH`,
            humidity: `Humidity: ${humidity}%`,
        }

        const forecastDiv = document.querySelector("#forecast-container");
        const forecastDayDiv = document.createElement('div');
        const forecastDateEl = document.createElement('h4');
        const forecastTempEl = document.createElement('p');
        const forecastWindEl = document.createElement('p');
        const forecastHumidityEl = document.createElement('p');

        forecastDateEl.textContent = forecastDay.date;
        forecastTempEl.textContent = forecastDay.temp;
        forecastWindEl.textContent = forecastDay.wind;
        forecastHumidityEl.textContent = forecastDay.humidity;


        forecastDayDiv.setAttribute(
            'style',
            'min-width: 75px; width: 16%; background-color: rgb(50,61,79); border: solid 2px rgb(120, 120, 120); border-radius: 5px;'
        )

        forecastDateEl.setAttribute(
            'style',
            'color: white; font-size: 18px; font-weight: 800; padding: 3px; margin-bottom: 8px;'
        )

        forecastTempEl.setAttribute(
            'style',
            'color: white; font-size: 16px; font-weight: 500; padding: 3px; margin-bottom: 8px;'
        )

        forecastWindEl.setAttribute(
            'style',
            'color: white; font-size: 16px; font-weight: 500; padding: 3px; margin-bottom: 8px;'
        )

        forecastHumidityEl.setAttribute(
            'style',
            'color: white; font-size: 16px; font-weight: 500; padding: 3px; margin-bottom: 8px;'
        )

        forecastDayDiv.append(forecastDateEl, forecastTempEl, forecastWindEl, forecastHumidityEl);
        forecastDiv.append(forecastDayDiv);
    }
}

/*
When search form is submitted, prevents default, ensures that a value is entered, and creates a variable for that value which it passes to the fetch function. 
*/
function handleSearchFormSubmit(event) {
    event.preventDefault();
    const searchInputVal = document.querySelector('#city-input').value;

    if (!searchInputVal) {
        console.error("You need to enter a city!");
        return;
    } 

    fetchCurrentWeather(searchInputVal);
    fetchForecast(searchInputVal);
    saveSearchedCity(searchInputVal);
    renderCurrentWeather();
    renderForecastWeather();
    saveSearchedCity(searchInputVal);
    renderSearchHistory(searchInputVal);
}

/*
Save city to local storage
*/
function saveSearchedCity(searchInputVal) {
    const storedCities = JSON.parse(localStorage.getItem('searchInputVal')) || [];
    for (i = 0; i < storedCities.length; i++) {
        if (storedCities[i] !== searchInputVal) {
            storedCities.push(searchInputVal);
            localStorage.setItem('searchInputVal', JSON.stringify(storedCities));
        }
    }
}

/*
Add event listener for submitting city search
*/
document.querySelector("#search-form").addEventListener("submit", handleSearchFormSubmit)

function wipeCurrentWeather() {
    document.querySelector("#today-weather").innerHTML = "";
}

function wipeForecastWeather() {
    document.querySelector("#forecast-container").innerHTML = "";
}

function renderSearchHistory() {
    const storedCities = JSON.parse(localStorage.getItem('searchInputVal')) || [];

    console.log(storedCities);

    if (storedCities !== null) {
        for (let i = 0; i < storedCities.length; i++) {
            const searchHistoryDiv = document.querySelector("#search-history");
            const searchedCityDiv = document.createElement('div');
            const searchedCityEl = document.createElement('p');

            const storedCity = storedCities[i];

            searchedCityEl.textContent = storedCity;

            searchedCityDiv.setAttribute(
                'style',
                'background-color: rgb(170, 170, 170); border: solid 1px rgb(170, 170, 170); border-radius: 15px; width: 100%; :hover'
            )

            searchedCityEl.setAttribute(
                'style',
                'font-size: 14px; color: var(--mainText); padding: 4px; margin-bottom: 10px;'
            )

            searchedCityDiv.append(searchedCityEl);
            searchHistoryDiv.append(searchedCityDiv);

            searchedCityDiv.onmouseover = function() {
                mouseOver();
            }

            function mouseOver() {
                searchedCityDiv.setAttribute(
                    'style',
                    'cursor: pointer'
                )
            }

            searchedCityDiv.addEventListener('click', (event) => {
                const searchInputVal = searchedCityEl.text;

                fetchCurrentWeather(searchInputVal);
                fetchForecast(searchInputVal);
                renderCurrentWeather();
                renderForecastWeather();
            })
        }
    }
}

function init() {
    renderSearchHistory();
};

