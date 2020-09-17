// stores and returns the api key for the weather api
function getWeatherApiKey() {
    var weatherApiKey = "20ce152fba104603b4cb45bef144122a";
    return weatherApiKey;
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

// retrieves and returns the start time from the user input
function getStartTime() {
    // placeholder value -- to store the start time provided by the user in the UI
    var startTime = moment("2020-09-17 12:00");
    return startTime;
}

// retrieves and returns the end time from the user input
function getFinishTime() {
    // placeholder value -- to store teh finish time provided by the user in the UI
    var finishTime = moment("2020-09-17 18:00");
    return finishTime;
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

    // grab the start and finish times from the user input
    var startTime = getStartTime();
    var finishTime = getFinishTime();

    // go through every hour for the next 48 hours and display the data in the console
    for (var i = 0; i < response.data.length; i++) {

        // retrieve and store 
        var time = moment(response.data[i].timestamp_local);

        // if data index is after start time and before finish time then display data
        if (moment(time).isSame(moment(startTime)) ||
            moment(time).isAfter(moment(startTime)) && moment(time).isBefore(moment(finishTime)) ||
            moment(time).isSame(moment(finishTime))) {
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

        // if data index is after start time then break from for loop

    }
}

// creates a url friendly location using the users inputs to be added to the query URL
function createLocation(cityInput, countryInput) {
    // declare variable to store new location for url
    var location = "";

    // if city and country are empty
    if (cityInput === "" && countryInput === "") {
        // display error message
        console.log("city and country are empty");
        // if city is empty but country is NOT empty
    } else if (cityInput === "" && countryInput != "") {
        // location becomes the country
        console.log("city is empty")
            // if city is NOT empty and country is empty
    } else if (cityInput != "" && countryInput === "") {
        // location becomes the city
        location += cityInput;
        // if city and country are NOT empty
    } else if (cityInput != "" && countryInput != "") {
        // location becomes a concatenation of city and country separated by a comma
        location = `${cityInput},${countryInput}`;
    }
    // return newly created location
    return location;
}

// creates the url to retrieve weather data from the weather api
// location input will be provided by user
function createWeatherUrl(cityInput, countryInput) {
    // creates a url friendly location using the users inputs to be added to the query URL
    var location = createLocation(cityInput, countryInput);
    // retrieves and stores the weather api key
    var apiKey = getWeatherApiKey();
    // the base url for the weather api
    var baseUrl = "https://api.weatherbit.io/v2.0/forecast/hourly";
    // create query url with the base url, location and api key
    var queryUrl = baseUrl +
        "?key=" + apiKey +
        "&city=" + location;
    // return the newly created query url
    console.log(queryUrl);
    return queryUrl;
}

// returns location with lower case letters and replaces all whitespaces with url friendly %20
function makeUrlFriendly(location) {
    return location.toLowerCase().replace(/\s/g, "%20");
}

// placeholder function to retrieve the country input from the user
function getCountryInput() {
    // placeholder variable -- here is where to retrieve the user input data for country from the UI
    var country = "australia";
    // makes the input url friendly
    var countryFriendlyUrl = makeUrlFriendly(country);
    // returns newly created country string
    return countryFriendlyUrl;
}

// placeholder function to retrieve the city input from the user
function getCityInput() {
    // placeholder value -- here is where to retrieve the user input data for city from the UI
    var city = "melbourne";
    // makes the input url friendly
    var cityFriendlyUrl = makeUrlFriendly(city);
    // return newly created city string
    return cityFriendlyUrl;
}

// calls the weather api
function callWeatherApi() {
    // retrieves and stores the city input from the user UI
    var cityInput = getCityInput();
    // retrieves and stores the country input from the user UI
    var countryInput = getCountryInput();
    // create and store the query url with the location given by the user
    var queryUrl = createWeatherUrl(cityInput, countryInput);
    // ajax call
    $.ajax({
            url: queryUrl,
            method: "GET"
                // process retrieved weather data
        }).then(processWeatherData)
        // catch error if call is unsuccessful
        .catch(function(error) {
            console.log("Catch error");
        });
}

// activates the call to the weather api
callWeatherApi();