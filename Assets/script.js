function getWeatherApiKey() {
    var weatherApiKey = "20ce152fba104603b4cb45bef144122a";
    return weatherApiKey;
}

function createWeatherUrl() {
    var apiKey = getWeatherApiKey();
    var location = "melbourne,australia";
    var baseUrl = "https://api.weatherbit.io/v2.0/forecast/hourly";
    var queryUrl = baseUrl +
        "?key=" + apiKey +
        "&city=" + location;
    return queryUrl;
}

function processWeatherData(response) {
    console.log(response);
    console.log(`Weather Description: ${response.data[0].weather.description}`);
    console.log(`Temperature: ${response.data[0].temp}`);
    console.log(`UV Index: ${response.data[0].uv}`);
    console.log(`Precipitation: ${response.data[0].precip}`);
    console.log(`Wind Speed: ${response.data[0].wind_spd}`);
    console.log(`Icon: ${response.data[0].weather.icon}`);

    console.log(`Location: ${response.city_name}`);
    console.log(`Country: ${response.country_code}`);
    console.log(`Latitude: ${response.lat}`);
    console.log(`Longitude: ${response.lon}`);
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