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
    // to store the start time provided by the user in the UI - PLACEHOLDER value

    // NEED TO MAKE SURE USER ONLY PUTS IN FUTURE TIME

    // START TIME HAS TO BE BEFORE FINISH TIME

    var startTime = moment("2020-09-17 12:00");
    return startTime;
}

// retrieves and returns the end time from the user input
function getFinishTime() {
    // to store the finish time provided by the user in the UI - PLACEHOLDER value

    // NEED TO PLACE LIMIT ON USER INPUT TO LESS THAN 48 HOURS!!

    var finishTime = moment("2020-09-17 18:00");
    return finishTime;
}

// retrieves the temperature for the time of the day
function hourlyTempCheck(response) {
    var temperature = response.temp;
    console.log(`Temperature: ${temperature}`);
}

// checks the uv for the time of the day
function hourlyUvCheck(response) {
    // get the uv for the for the time of day
    var uvIndex = response.uv;
    // set the uv threshold
    var uvThreshold = 2;
    // if index is greater than uv threshold
    if (uvIndex >= uvThreshold) {
        // display uv message - this is where functions can got to display to the user what to wear - PLACEHOLDER
        console.log(`UV Index: ${uvIndex}`);
        console.log("You will need sunprotection today, wear a hat or apply sunscreen regularly");
    } else {
        // else because we don't want to give false info, this is a disclaimer
        console.log("UV is low but it is still advised to prtoect yourself from UV");
    }
}

// checks the precipitation for the time of the day
function hourlyRainCheck(response) {
    // retrieves and stores the precipitation level
    var precip = response.precip;
    // this is the precipitation threshold
    var precipThreshold = 5;
    // if the precipitation level is above the threshold
    if (precip > precipThreshold) {
        // display to the user what to wear - this is where functions can go to diaplsy info to the user - PLACEHOLDER
        console.log(`Precipitation: ${precip}mm`);
        console.log("You will need a waterproof or an umbrella");
    }
}

// checks the wind speed for the given time of day
function hourlyWindCheck(response) {
    // retrieves and stores the wind speed for the time of day 
    var windSpeed = response.wind_spd;
    // wind speed threshold
    var windSpeedThreshold = 10;
    // if the wind speed is greater than the threshold
    if (windSpeed > windSpeedThreshold) {
        // display to the user what to wear - this is where functions can go to update the display - PLACEHOLDER
        console.log(`Wind Speed: ${windSpeed}km/h`);
        console.log("You will need wind protection");
    }
}

// retrieves and stores the url for the weather icon for the time of the day
function hourlyDisplayIcon(response) {
    // store and retrieve the icon code
    var iconCode = response.weather.icon;
    // use the icon code to createa a new url for the code from the api - the url can be used to update the UI, functions to do that will go here - PLACEHOLDER
    var iconUrl = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`
    console.log(`Icon: ${iconUrl}`);
}

// processes the weather data retrieved from the weather api
function processHourlyWeatherData(response) {
    console.log(response);

    // store, retrieve and display the location and country
    var cityName = response.city_name;
    var countryCode = response.country_code

    console.log(`Location: ${cityName}`);
    console.log(`Country: ${countryCode}`);

    // retrieve and store the latitude and longitude of the responded weather data
    // to be used for zomato api
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

            // depending on temperature select range of clothes for warmth or to stay cool
            hourlyTempCheck(response.data[i]);

            // if uv index is above 2 then display you will need sun protection ie sunscreen or hat
            hourlyUvCheck(response.data[i]);

            // if precipitation is above certain level then you will need rain protection ie waterproof or umbrella
            hourlyRainCheck(response.data[i]);

            // if wind is above certain value then you will need wind protection ie windproof fleece or jacket
            hourlyWindCheck(response.data[i]);

            hourlyDisplayIcon(response.data[i]);

            console.log(`------------------------------`);
        }
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
function createHourlyWeatherUrl(cityInput, countryInput) {
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
    return queryUrl;
}

// returns location with lower case letters and replaces all whitespaces with url friendly %20
function makeUrlFriendly(location) {
    return location.toLowerCase().replace(/\s/g, "%20");
}

// placeholder function to retrieve the country input from the user - PLACEHOLDER
function getCountryInput() {
    // placeholder variable -- here is where to retrieve the user input data for country from the UI - PLACEHOLDER
    var country = "australia";
    // makes the input url friendly
    var countryFriendlyUrl = makeUrlFriendly(country);
    // returns newly created country string
    return countryFriendlyUrl;
}

// placeholder function to retrieve the city input from the user - PLACEHOLDER
function getCityInput() {
    // placeholder value -- here is where to retrieve the user input data for city from the UI - PLACEHOLDER
    var city = "melbourne";
    // makes the input url friendly
    var cityFriendlyUrl = makeUrlFriendly(city);
    // return newly created city string
    return cityFriendlyUrl;
}

// calls the weather api
function callHourlyWeatherApi() {
    // retrieves and stores the city input from the user UI
    var cityInput = getCityInput();
    // retrieves and stores the country input from the user UI
    var countryInput = getCountryInput();
    // create and store the query url with the location given by the user
    var queryUrl = createHourlyWeatherUrl(cityInput, countryInput);
    // ajax call
    $.ajax({
            url: queryUrl,
            method: "GET"
                // process retrieved weather data
        }).then(processHourlyWeatherData)
        // catch error if call is unsuccessful
        .catch(function(error) {
            console.log("Catch error");
        });
}

// activates the call to the hourly weather data from the api
callHourlyWeatherApi();