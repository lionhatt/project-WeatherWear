// stores and returns the api key for the weather api
function getWeatherApiKey() {
    var weatherApiKey = "20ce152fba104603b4cb45bef144122a";
    return weatherApiKey;
}

// creates the url to retrieve weather data from the weather api
// locatino input will be provided by user
function createWeatherUrl(location) {
    // retrieves and stores the weather api key
    var apiKey = getWeatherApiKey();
    // the base url for the weather api
    var baseUrl = "https://api.weatherbit.io/v2.0/forecast/hourly";
    // create query url with the base url, location and api key
    var queryUrl = baseUrl +
        "?key=" + apiKey +
        "&city=" + location;
    // return the newly created query url
    return queryUrl;
}

// retrieves and stores the latitude value for the responded weather data
function getLatitude(response) {
    var latitude = response.lat;
    return latitude;
}

// retrieves and stores the longitude value for the responded weather data
function getLongitude(response) {
    var longitude = response.lon;
    return longitude;
}

// processes the weather data retrieved from the weather api
function processWeatherData(response) {
    console.log(response);
    console.log(`Location: ${response.city_name}`);
    console.log(`Country: ${response.country_code}`);

    // retrieve and store the latitude and longitude of the responded weatehr data
    var latitude = getLatitude(response);
    var longitude = getLongitude(response);

    console.log(`Latitude: ${latitude}`);
    console.log(`Longitude: ${longitude}`);

    // go through every hour for the next 48 hours and display the data in the console
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

// calls the weather api
function callWeatherApi() {
    // stores location - placeholder - will contain information provided by the user
    // will need a function to turn the user input into a query friendly url element
    var location = "melbourne,australia";
    // create and store the query url with the location given by the user
    var queryUrl = createWeatherUrl(location);
    // ajax call
    $.ajax({
            url: queryUrl,
            method: "GET"
                // process retrieved weather dat
        }).then(processWeatherData)
        // catch error if call is unsuccessful
        .catch(function() {
            console.log("Catch error");
        });
}

// activates the call to the weather api
callWeatherApi();