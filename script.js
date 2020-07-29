// Code Github: https://github.com/euclidespaim/surf-weather
// api key: 62a23ddd825e4bdf8d3201942201407

// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

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
    let geoapi = `http://www.mapquestapi.com/geocoding/v1/reverse?key=${geokey}&location=${latitude},${longitude}&outFormat=xml`;

    //Fetch json from worldWeatherOnline
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){

            weather.temperature.value = data.data.weather[0].hourly[0].tempC;
            weather.iconId = data.data.weather[0].astronomy[0].moon_phase;
            weather.iconId = weather.iconId.replace(/\s/g, '');
            weather.description = data.data.weather[0].hourly[0].weatherDesc[0].value;

        })
        .then(function(){
            displayWeather();
        });

    //Request xml from mapQuestApi
    const request = new XMLHttpRequest();
    request.open("GET", geoapi, false);
    request.send();
    const xml = request.responseXML;
    weather.city = xml.getElementsByTagName("adminArea5")[0].textContent;
    weather.country = xml.getElementsByTagName("adminArea1")[0].textContent;

}

// DISPLAY WEATHER TO UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
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
