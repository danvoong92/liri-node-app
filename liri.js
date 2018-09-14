// Area to store 'require' modules as variables and import any API key from
// keys.js

require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var request = require("request");
var fs = require("fs");
var moment = require("moment");

// Begin functions to grab data from JSON using API and request methods

var searchBandsInTown = function(){
    var artistName = process.argv.slice(3).join(" ")
    var queryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

    request(queryURL, function (error, response, body){
        if (!error && response.statusCode == 200){
            var jsonData = JSON.parse(body);
            for (var i=0; i<jsonData.length; i++){
                console.log("=============================================================================");
                console.log("Venue Name: " + jsonData[i].venue.name);
                console.log("Venue Location: " + jsonData[i].venue.city + ", " + jsonData[i].venue.country);
                console.log("Date of Event: " +  moment(jsonData[i].datetime).format("MM/DD/YYYY"));
                console.log("=============================================================================");
            };
        };
    });
};

var searchSpotify = function(songName){
    spotify.search({ type: "track", query: songName }, function(error, data){
        if (error){
            return console.log("Error occurred: " + error);
        }
        
        var listArtists = function(artists){
            return artists.name;
        }

        var songs = data.tracks.items;
        for(var i=0; i<songs.length; i++){
            console.log("=============================================================================");
            console.log(i);
            console.log("Artist(s): " + songs[i].artists.map(listArtists));
            console.log("Song Name: " + songs[i].name);
            console.log("Preview Song: " + songs[i].preview_url);
            console.log("Album Name: " + songs[i].album.name);
            console.log("=============================================================================");
        }
    });
}

var searchOMDB = function(movieName){
    var queryURL = "http://www.omdbapi.com/?t=" + movieName +"&apikey=trilogy";

    request(queryURL, function (error, response, body) {
        if (!error && response.statusCode == 200){        
            var jsonData = JSON.parse(body);
            console.log("=============================================================================");
            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
            console.log("=============================================================================");
        };
    });
};

var followRandom = function(){
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error) throw error;
    
        var array = data.split(",");

        if (array.length == 2){
            argValues(array[0], array[1]);
        }
        else if (array.length == 1){
            argValues(array[0]);
        }
    });
}

// Create function to initate switch case statement that will allow user
// to input specific commands to terminal

var argValues = function(data, readInput){
    switch(data) {
        case "concert-this":
            searchBandsInTown();
            break;
        case "spotify-this-song":
            searchSpotify(readInput);
            break;
        case "movie-this":
            searchOMDB(readInput);
            break;
        case "do-what-it-says":
            followRandom();
            break;
        default:
        console.log("LIRI does not understand your request.");
    }
}

// Create a function that calls argValues() function and take in two arguments as user input

var startProcess = function(argOne, argTwo){
    argValues(argOne, argTwo);
}

// Call startProcess() function

startProcess(process.argv[2], process.argv.slice(3));