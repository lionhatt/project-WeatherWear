function getWeatherApiKey() {
    var weatherApiKey = "dcb3883295f5de3cfa7d16b16a5a61ae";
    return weatherApiKey;
}

function createWeatherUrl() {
    var apiKey = getWeatherApiKey();
    var location = "melbourne";
    var baseUrl = "http://api.weatherstack.com/current?";
    var queryUrl = baseUrl +
        "access_key=" + apiKey +
        "&query=" + location;
    return queryUrl;
}

function processWeatherData(response) {
    console.log(response);
    console.log(`Weather Description: ${response.current.weather_descriptions[0]}`);
    console.log(`Temperature: ${response.current.temperature}`);
    console.log(`Feels Like: ${response.current.feelslike}`);
    console.log(`UV Index: ${response.current.uv_index}`);
    console.log(`Precipitation: ${response.current.precip}`);
    console.log(`Wind Speed: ${response.current.wind_speed}`);
    console.log(`Icon URL: ${response.current.weather_icons[0]}`);

    console.log(`Location: ${response.location.name}`);
    console.log(`Counrty: ${response.location.country}`);
}

function callWeatherApi() {
    var location = null;
    var queryUrl = createWeatherUrl();
    $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(processWeatherData)
        .catch(function() {
            console.log("Catch error");
        });
}

callWeatherApi();