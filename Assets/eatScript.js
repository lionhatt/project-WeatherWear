// stores and returns the api key for the weather api
function getZomatoApiKey() {
    var zomatoApiKey = "321d2a4a5c913d09f0f04880bf418ff2"
    return zomatoApiKey;
}

var maxResults = 6;
var zomatoBaseUrl="https://developers.zomato.com/api/v2.1"

function searchZomato(location) {
    // create get location url
    var locationUrl = `${zomatoBaseUrl}/locations?query=${location}`;
    // call zomato to get enitiyid
    return $.ajax({
        method: "GET",
        url: locationUrl,
        headers: {
            "user-key": getZomatoApiKey()
        }
    }).then(function(result) {
        var zomatoEntityId = (result.location_suggestions[0].entity_id)
        var zomatoEntityType = (result.location_suggestions[0].entity_type)
        
        var searchUrl = `${zomatoBaseUrl}/search?entity_id=${zomatoEntityId}&entity_type=${zomatoEntityType}&count=${maxResults}`;

    
        return $.ajax({
            method: "GET",
            url: searchUrl,
            headers: {
                "user-key": getZomatoApiKey()
            }
        }).then(function(result) {
            var restaurantResults = [];

            result.restaurants.forEach(function (r) {
                var cuisines = r.restaurant.cuisines;
                var name = r.restaurant.name;
                var thumb = r.restaurant.thumb;
                
                restaurantResults.push({ cuisines, name, thumb });
            });

            return restaurantResults;
    
        })
    })
}

function submitEatForm(event) {
    event.preventDefault();

    var locationInput = document.getElementById("location");
    var resultsElement = document.getElementById("results")
    resultsElement.innerHTML = "";

    searchZomato(locationInput.value || "melbourne")
        .then(function (results) {

            results.forEach(function (restaurant) {
                var resultElement = document.createElement("div");

                var nameElement = document.createElement("div");
                nameElement.textContent = restaurant.name;
                resultElement.appendChild(nameElement)

                var cuisineElement = document.createElement("div");
                cuisineElement.textContent = restaurant.cuisines;
                resultElement.appendChild(cuisineElement)

                var thumbElement = document.createElement("img");
                thumbElement.setAttribute("src", restaurant.thumb);
                resultElement.appendChild(thumbElement)

                resultsElement.appendChild(resultElement)
            })

        });
}

document.getElementById("eatForm").onsubmit = submitEatForm;