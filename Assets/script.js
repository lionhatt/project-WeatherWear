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
    console.log(`Location: ${response.city_name}`);
    console.log(`Country: ${response.country_code}`);
    console.log(`Latitude: ${response.lat}`);
    console.log(`Longitude: ${response.lon}`);

    for (var i = 0; i < response.data.length; i++) {
        console.log(`------------------------------`);
        console.log(`Time: ${moment(response.data[i].timestamp_local).format("MMM Do, k:mm")}`);
        console.log(`Weather Description: ${response.data[i].weather.description}`);
        console.log(`Temperature: ${response.data[i].temp}`);
        console.log(`UV Index: ${response.data[i].uv}`);
        console.log(`Precipitation: ${response.data[i].precip}`);
        console.log(`Wind Speed: ${response.data[i].wind_spd}`);
        console.log(`Icon: ${response.data[i].weather.icon}`);
        console.log(`------------------------------`);
    }
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