// object to store response, min, max and average temps
var currentWeather = {}

// stores and returns the api key for the weather api
function getWeatherApiKey() {
    var weatherApiKey = "20ce152fba104603b4cb45bef144122a"
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

// creates the user input choice list of times based on the current time and date
function createInputTimes() {
    var goingOutSelect = $("#goingOutTime");
    var comingHomeSelect = $("#comingHomeTime");
    var dateNow = moment();
    for (var i = 0; i < 48; i++) {
        var newDate = moment(dateNow).add(i, 'hours');
        goingOutSelect.append(`<option value="${newDate}">${newDate.format("Do MMM - h:00a")}</option>`);
        comingHomeSelect.append(`<option value="${newDate}">${newDate.format("Do MMM - h:00a")}</option>`);
    }
}

// retrieves and returns the start time from the user input
function getStartTime() {
    var goingOutselect = $("#goingOutTime").val();
    var startTime = moment(goingOutselect).subtract(1, 'hours');
    return startTime;
}

// retrieves and returns the end time from the user input
function getFinishTime() {
    var comingHomeselect = $("#comingHomeTime").val();
    var finishTime = moment(comingHomeselect);
    return finishTime;
}

function findAverageUv(uvs) {
    var avgUv = 0;
    var sum = 0;
    uvs.forEach(function(uv) {
        sum += uv;
    });
    avgUv = sum / uvs.length;
    uvCheck(avgUv)
}

// checks the uv for the time of the day
function uvCheck(avgUv) {
    var uvThreshold = 2.0;

    if (avgUv >= uvThreshold) {
        // display uv message - this is where functions can got to display to the user what to wear - PLACEHOLDER
        currentWeather.backgroundImage = "var(--sunny-image)";
        if (!chosenWears.includes("sunglasses")) {
            chosenWears.push("sunglasses");
        }
    } else {
        currentWeather.backgroundImage = "var(--bluesky-image)"
    }
}

function findAverageRain(rains) {
    var avgRain = 0;
    var sum = 0;
    rains.forEach(function(rain) {
        sum += rain;
    });
    avgRain = sum / rains.length;
    rainCheck(avgRain)
}

// checks the precipitation for the time of the day
function rainCheck(avgRain) {
    var precipThreshold = 5;

    if (avgRain > precipThreshold) {
        // display to the user what to wear - this is where functions can go to display info to the user - PLACEHOLDER
        currentWeather.bakcgroundImage = "var(--rainy-image)"
        if (!chosenWears.includes("umbrella")) {
            chosenWears.push("umbrella");
        }
    } else {
        currentWeather.bakcgroundImage = "var(--bluesky-image)"
    }
}

function findAverageWind(winds) {
    var avgWind = 0;
    var sum = 0;
    winds.forEach(function(wind) {
        sum += wind;
    });
    avgWind = sum / winds.length;
    windCheck(avgWind)
}

// checks the wind speed for the given time of day
function windCheck(avgWind) {
    var windSpeedThreshold = 10;

    if (avgWind > windSpeedThreshold) {
        // display to the user what to wear - this is where functions can go to update the display - PLACEHOLDER
        if (!chosenWears.includes("scarve")) {
            chosenWears.push("scarve");
        }
    }
}

function setBackgroundImage() {
    var backgroundImage = currentWeather.backgroundImage;
    $('body').css('background-image', backgroundImage);
}

// finds the minimum temperature in an array of temps provided by the api
function findMinTemp(temps) {

    var minTemp = temps[0];
    temps.forEach(function(temp) {

        if (minTemp > temp) {
            minTemp = temp;
        }
    });
    return minTemp;
}

// finds the maximum temperature in an array of temps provided by the api
function findMaxTemp(temps) {
    var maxTemp = temps[0];
    temps.forEach(function(temp) {

        if (maxTemp < temp) {
            maxTemp = temp;
        }
    });
    return maxTemp;
}

// finds the average temperature in an array of temperatures provided by the weather api
function findAverageTemp(temps) {
    var avgTemp = 0;
    var sum = 0;
    temps.forEach(function(temp) {
        sum += temp;
    });
    avgTemp = sum / temps.length;
    return avgTemp;
}

// processes the weather data retrieved from the weather api
function processHourlyWeatherData(response) {

    // stores response object in currentWeather object
    currentWeather.response = response;

    // store, retrieve in currentWeather object
    currentWeather.cityName = response.city_name;
    currentWeather.countryCode = response.country_code

    // retrieve and store the latitude and longitude of the responded weather data
    // to be used for zomato api
    currentWeather.latitude = getLatitude(response);
    currentWeather.longitude = getLongitude(response);

    // grab the start and finish times from the user input
    currentWeather.startTime = getStartTime();
    currentWeather.finishTime = getFinishTime();

    // array to store the temps for every hour
    currentWeather.temps = [];
    currentWeather.uvs = [];
    currentWeather.rains = [];
    currentWeather.winds = [];

    // go through every hour for the next 48 hours and display the data
    response.data.forEach(function(dataObject) {

        // retrieve and store 
        var time = moment(dataObject.timestamp_local);

        // if data index is after start time and before finish time then display data
        if (moment(time).isSame(moment(currentWeather.startTime)) ||
            moment(time).isAfter(moment(currentWeather.startTime)) && moment(time).isBefore(moment(currentWeather.finishTime)) ||
            moment(time).isSame(moment(currentWeather.finishTime))) {

            currentWeather.temps.push(dataObject.temp);
            currentWeather.uvs.push(dataObject.uv);
            currentWeather.rains.push(dataObject.precip);
            currentWeather.winds.push(dataObject.wind_spd);
        }
    });

    findAverageTemp(currentWeather.temps);
    findAverageUv(currentWeather.uvs);
    findAverageRain(currentWeather.rains);
    findAverageWind(currentWeather.winds);
    setBackgroundImage();
    // clear the clothes
    $(".weatherDisplay").empty();
    renderChosenWears();
}

// creates a url friendly location using the users inputs to be added to the query URL
function createLocation(cityInput, countryInput) {
    var location = "";

    if (cityInput != "" && countryInput === "") {
        location += cityInput;
    } else if (cityInput != "" && countryInput != "") {
        location = `${cityInput},${countryInput}`;
    }
    return location;
}

// creates the url to retrieve weather data from the weather api
// location input will be provided by user
function createHourlyWeatherUrl(cityInput, countryInput) {
    var location = createLocation(cityInput, countryInput);
    var apiKey = getWeatherApiKey();
    var baseUrl = "https://api.weatherbit.io/v2.0/forecast/hourly";
    var queryUrl = baseUrl +
        "?key=" + apiKey +
        "&city=" + location;
    return queryUrl;
}

// returns location with lower case letters and replaces all whitespaces with url friendly %20
function makeUrlFriendly(location) {
    return location.toLowerCase().replace(/\s/g, "%20");
}

// placeholder function to retrieve the country input from the user - PLACEHOLDER
function getCountryInput() {
    var country = $("#country").val();
    var countryFriendlyUrl = makeUrlFriendly(country);
    return countryFriendlyUrl;
}

// placeholder function to retrieve the city input from the user - PLACEHOLDER
function getCityInput() {
    var city = $("#location").val();
    var cityFriendlyUrl = makeUrlFriendly(city);
    return cityFriendlyUrl;
}

// calls the weather api for the hourly weather
function callWeatherApi() {
    var cityInput = getCityInput();
    var startTime = getStartTime();
    var finishTime = getFinishTime();
    var timesValid = false;
    var cityValid = false;

    // check if start time is before the finish time and alter timesValid 
    // to true if they are else false if not and display error message in modal
    if (startTime.isBefore(finishTime) || startTime.isSame(finishTime)) {
        timesValid = true;
    } else {
        $("#modal-message").text("Please make sure the going out time is before the coming home time");
        $("#modal").show();
    }

    // if the city input is empty then don't make the weather api call
    if (cityInput != "") {
        cityValid = true;
    } else {
        // display error message if city is not inputted
        $("#modal-message").text("Please enter a location name");
        $("#modal").show();
    }

    // if the inputs are valid then call the weather api
    if (timesValid && cityValid) {
        var countryInput = getCountryInput();
        var queryUrl = createHourlyWeatherUrl(cityInput, countryInput);
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(processHourlyWeatherData)
    }
}

//the oject for clothing suggestions
var wears = {
    //the base layer will add [1,2,3,4,5] °C to the body heat
    baseLayer: ["t-shirt", "long-sleeve-shirt", "flannel-shirt", "sweatshirt", "sweater"],
    //the outer later will add [9,10,11] °C to the body heat
    outerLayer: ["short-jacket", "coat", "down-jacket"]
}

// array of suggested clothing based on temprature
var chosenWears = [];

// function to append suggested clothing into chosenWears array
function renderChosenWears() {

    // thi is the optimal temprature trying to achive at 26°C
    var optimalTemp = 26

    chosenWears = [];

    // find and store the min and max temps of the currentWeather object
    var minTemp = findMinTemp(currentWeather.temps);
    var maxTemp = findMaxTemp(currentWeather.temps);

    //if the min temp is higher than the optimal temprature, it will suggest basic clothing
    if (minTemp >= optimalTemp) {
        chosenWears.push(wears.baseLayer[0]);
        //if the min temp is lower then 5°C, it will give the maximum clothing suggestion  
    } else if (minTemp <= 5) {
        chosenWears.push(wears.outerLayer[2]);
        chosenWears.push(wears.baseLayer[1], wears.baseLayer[2], wears.baseLayer[4]);
        //if the min temp is in between 5-26°C:  
    } else {
        //if the maxtemp is higher then the optimal temprature, it will set maxtemp as the optimal at 26°C
        if (maxTemp >= optimalTemp) {
            maxTemp = optimalTemp;
        }
        //if the difference between max and min temp is greater than 11°C, it will append down-jacket to suggestion
        if ((maxTemp - minTemp) >= 11) {
            chosenWears.push(wears.outerLayer[2]);
            //if the difference between max and min temp is equal to  10°C, it will append coat to suggestion  
        } else if ((maxTemp - minTemp) === 10) {
            chosenWears.push(wears.outerLayer[1]);
            //if the difference between max and min temp is equal to  9°C, it will append short-jacket to suggestion 
        } else if ((maxTemp - minTemp) === 9) {
            chosenWears.push(wears.outerLayer[0]);
            //if the difference between max and min temp is less than 9°C, it will discard the difference, at calculate based on min temp only   
        } else if ((maxTemp - minTemp) < 9) {
            maxTemp = minTemp;
        }
        //if the temprature is greater then 16°C, it will itterate through the base layer to append suggestions
        if (maxTemp >= 16) {
            optimalTemp = optimalTemp - maxTemp;
            for (let k = wears.baseLayer.length - 1; k >= 0; k--) {
                if (optimalTemp >= (k + 1)) {
                    optimalTemp = optimalTemp - (k + 1);
                    chosenWears.push(wears.baseLayer[k]);
                }
            }
            //if the temparture is less then 16°C  , it will itterate through the outer layer for 1 itme ,and then through base layer to append suggestions
        } else if (maxTemp < 16) {
            optimalTemp = optimalTemp - maxTemp;
            for (let u = wears.outerLayer.length - 1; u >= 0; u--) {
                if (optimalTemp >= (u + 9)) {
                    optimalTemp = optimalTemp - (u + 9);
                    chosenWears.push(wears.outerLayer[u]);
                    break;
                }
            }
            for (let k = wears.baseLayer.length - 1; k >= 0; k--) {
                if (optimalTemp >= (k + 1)) {
                    optimalTemp = optimalTemp - (k + 1);
                    chosenWears.push(wears.baseLayer[k]);
                }
            }
        }
    }
    renderClothRec();
}

//function to append recommended itmes on the html
function renderClothRec() {
    var weatherDiv = $('<div id= "weatherDiv">');
    var maxP = $('<p id="maxP">');
    maxP.append("Maximum Temprature: " + findMaxTemp(currentWeather.temps) + "°C");
    var minP = $('<p id="minP">');
    minP.append("Minimum Temprature: " + findMinTemp(currentWeather.temps) + "°C");
    weatherDiv.append(maxP, minP);
    $(".weatherDisplay").append(weatherDiv);
    $.each(chosenWears, function(index, value) {
        var wearDiv = $('<div class="wearDiv">');
        var wearImage = $("<img>");
        var wearP = $("<p>");
        wearP.text(value);
        var wearURL = "Assets/img/" + value + ".jpg";
        $(wearImage).attr({ src: wearURL, alt: value });
        wearDiv.append(wearImage, wearP);
        $(".weatherDisplay").append(wearDiv);
    })
}

function closeModal() {
    $("#modal").hide();
}

// activates the call to the weather api
$("#confirmButton").on("click", callWeatherApi);
$("#close-modal").on("click", closeModal);

createInputTimes();

function buildURL(entityid, entityType) {
    // Get the value of whatever option is selected from the drop down and store it in variable
    var cuisineElement = $("#cuisines")
    var cuisineidval = cuisineElement.val()
    var sortElement = $("#eatFormSort")
    var sortval = sortElement.val()

    var paramarray = [{ cuisines: cuisineidval }, { sort: sortval }]

    var baseUrl = "https://developers.zomato.com/api/v2.1/search?"
    var urlObj = {
        entity_id: entityid,
        entity_type: entityType,
        start: "0",
        count: "10",
        order: sortval === "cost" ? "asc" : "desc"
    }

    paramarray.forEach(function(item) {
        Object.keys(item).forEach(function(key) {
            if (item[key] !== "") { urlObj[key] = item[key] }
        })
    })

    buildUrl = baseUrl + $.param(urlObj)
    return buildUrl
}

function DisplayResponse(obj) {
    var restaurants = obj.restaurants[0]

    obj.restaurants.forEach(function(eatData) {
        var restaurant = eatData.restaurant;

        function openPage() {
            window.open(restaurant.url, "_blank")
        }

        var restaurantElem = $("<div>").attr("class", "restaurant");
        var img = $("<img>").attr("class", "restaurantImg").attr("src", restaurant.thumb);
        var restaurantInfo = $("<div>").attr("class", "restaurantInfo")
        var restaurantName = $("<div>").attr("class", "restaurantName").text(restaurant.name)
        var restaurantRating = $("<div>").attr("class", "restaurantRating").text(`Rating: ${restaurant.user_rating.aggregate_rating}⭐`)
        var restaurantNumber = $("<div>").attr("class", "restaurantNumber").text(`Phone Number: ${restaurant.phone_numbers}`)
        var restaurantAddress = $("<div>").attr("class", "restaurantAddress").text(`Adress: ${restaurant.location.address}`)
        var restaurantCost = $("<div>").attr("class", "restaurantCost").text(`Cost: ${restaurant.currency}${restaurant.average_cost_for_two}`)

        restaurantInfo.append(restaurantName)
        restaurantInfo.append(restaurantRating)
        restaurantInfo.append(restaurantNumber)
        restaurantInfo.append(restaurantAddress)
        restaurantInfo.append(restaurantCost)

        restaurantElem.append(img)
        restaurantElem.append(restaurantInfo)
        restaurantElem.on("click", openPage)



        $(".restaurantsContainer").append(restaurantElem)
    });
    $(".restaurantsContainer").append($("<button>").attr("class", "closeBtn").text("CLOSE"))
    $(".closeBtn").on("click", function(event) {
        $(".restaurantsContainer").empty()
        $("#eat-form").addClass("hide")
    })

}

function buildLocationIDUrl() {
    var baseURL = "https://developers.zomato.com/api/v2.1/locations?"
    var urlObj = {
            query: getCityInput() || "melbourne", // default search to melbourne if no location
            count: 20,
        }
        // Click event on the submit form button should trigger this
        // buildAdvancedUrl(urlObj)
    var buildlocalURL = baseURL + $.param(urlObj)
    return buildlocalURL
}

function renderEatform(entityid) {
    $("#eat-form").removeClass("hide")
    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/cuisines?city_id=" + entityid,
        method: "GET",
        headers: {
            "user-key": "5eece0acc0b44cc0d90cea4773975dea",
            "content-type": "application/json"
        },
    }).then(function(response) {
        var cuisines = response.cuisines
        cuisines.forEach(function(item) {
            var option = $("<option>").text(item.cuisine.cuisine_name).attr("value", item.cuisine.cuisine_id)
            $("#cuisines").append(option)
        })
    })
}

$("#eatform").on("click", gettingEntityId)
    //Tells 

function gettingEntityId() {
    // clear the clothes
    $(".weatherDisplay").hide();
    $(".restaurantsContainer").empty()

    $('body').css('background-image', 'var(--restaurant-image');

    $.ajax({
        url: buildLocationIDUrl(),
        method: "GET",
        headers: {
            "user-key": "5eece0acc0b44cc0d90cea4773975dea",
            "content-type": "application/json"
        },
    }).then(function(response) {
        var entityid = response.location_suggestions[0].entity_id
        var entityType = response.location_suggestions[0].entity_type

        // zomatoAPIcall(entityid)
        $.ajax({
            url: buildURL(entityid, entityType),
            method: "GET",
            headers: {
                "user-key": "5eece0acc0b44cc0d90cea4773975dea",
                "content-type": "application/json"
            },
        }).then(function(response) {
            renderEatform(entityid)
            DisplayResponse(response)
        })
    })
}

$("#eatNav").on("click", gettingEntityId)
    //Tells 
$("#cuisines").change(gettingEntityId)
$("#eatFormSort").change(gettingEntityId)

$("#wearNav").on("click", function() {
    $(".weatherDisplay").show();
    $(".restaurantsContainer").empty();
    $("#eat-form").addClass("hide");
})