// Code Github: https://github.com/euclidespaim/surf-weather
// api key: 62a23ddd825e4bdf8d3201942201407

// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const waveElement = document.querySelector(".wave-height p");
const tideElement = document.querySelector(".tide-direction p");
const windElement = document.querySelector(".wind-direction p");

// App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

// API KEY
const key = "62a23ddd825e4bdf8d3201942201407";
const geokey = "I4KR18oZH2aAPTJdLGnVwAfZQdbLLYZI";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}
//SET HOUR OF FORECAST
function setTime(){
    let time = new Date();
    return Math.floor(time.getHours() /3);
}

// SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude){

    let api = `http://api.worldweatheronline.com/premium/v1/marine.ashx?key=${key}&format=json&q=${latitude},${longitude}`;
    let geoapi = `http://www.mapquestapi.com/geocoding/v1/reverse?key=${geokey}&location=${latitude},${longitude}&outFormat=json`;

    let hour = setTime();

    //Fetch json from worldWeatherOnline
    fetch(api)
        .then(function(response){
            let world = response.json();
            return world;
        })
        .then(function(world){

            weather.temperature.value = world.data.weather[0].hourly[hour].tempC;
            weather.iconId = world.data.weather[0].astronomy[0].moon_phase;
            weather.iconId = weather.iconId.replace(/\s/g, '');

            weather.description = world.data.weather[0].hourly[hour].weatherDesc[0].value;
            weather.wave = world.data.weather[0].hourly[hour].swellHeight_m;
            weather.tide = world.data.weather[0].hourly[hour].swellDir16Point;
            weather.wind = world.data.weather[0].hourly[hour].winddir16Point;
        });

    fetch(geoapi)
        .then(function (response){
            let quest = response.json();
            return quest;
        })
        .then(function (quest){

            weather.city = quest.results[0].locations[0].adminArea5;
            weather.country = quest.results[0].locations[0].adminArea1;
        })
        .then(function(){
            displayWeather();
        });

    // //Request xml from mapQuestApi
    // const request = new XMLHttpRequest();
    // request.open("GET", geoapi, false);
    // request.send();
    // const xml = request.responseXML;
    // weather.city = xml.getElementsByTagName("adminArea5")[0].textContent;
    // weather.country = xml.getElementsByTagName("adminArea1")[0].textContent;

}

// DISPLAY WEATHER TO UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    waveElement.innerHTML = `${weather.wave} <span>m</span>`;
    tideElement.innerHTML = `${weather.tide}`;
    windElement.innerHTML = `${weather.wind}`;
}

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENT
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;

    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});
