var Twitter = require('twitter');
var Keys = require('./keys.js');
var Request = require('request');
var Spotify = require('node-spotify-api');
var Fs = require('fs');

var args = process.argv.slice(2, process.argv.length);

function doSomething(args) {

	var operation = args.shift().toLowerCase();

	switch (operation) {
		case 'my-tweets':
		twitterFetch();
		break;
		case 'spotify-this-song':
		spotifyFetch();
		break;
		case 'movie-this':
		omdbFetch();
		break;
		case 'do-what-it-says':
		fromFile();
		break;
		default: 
		console.log("Sorry, current build only accepts 4 commands: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'].");
		console.log("For help with any command, pass it '-h' or '--help'.");
	}

	function twitterFetch() {

		//console.log("Trying to grab tweets");

		var tweetArray = [];

		var client = new Twitter(Keys.twitterKeys);

		if (args[0] === '-h' || args[0] === '--help') {
			console.log('my-tweets does not accept arguments. Well, except for this one');
		}

		//Gets logged in user (though this will always be me since we don't actually use logins in this app)
		client.get('account/verify_credentials.json', function(error, tweets, response) {
			if (!error) {
				var resJSON = JSON.parse(response.toJSON().body);
				var screen_name = resJSON.screen_name
				//console.log(screen_name);
				var timelineParams = {
					screen_name: screen_name,
					count: 20,
				};
				//Gets last 20 tweets from logged in user (see passed params above)
				client.get('statuses/user_timeline', timelineParams, function(error, tweets, response) {
					if (!error) {
						tweetArray = tweets; 
						console.log("-------------------------------------------------------------------");
						console.log("Fetching up the last 20 tweets from the user:");
						console.log("-------------------------------------------------------------------");
						for (var i = 0; i < tweetArray.length; i++) {
							var tweetDate = (new Date(tweetArray[i].created_at));
							console.log("#" + (i+1) + " at " + tweetDate + ":");
							console.log(tweetArray[i].text);
							console.log("-------------------------------------------------------------------");
						}
					} else {
						throw error
					}
				});
			} else {
				throw error
			}
		});

	}

	function spotifyFetch() {
		if (!args || args.length === 0) {
			console.log("-------------------------------------------------------------------");
			console.log("This would be way more fun if you gave me a song to look up.");
			console.log('Here, take "The Sign" by Ace of Base instead.');
			args.push('The Sign Ace of Base');
		}
		
		var spotify = new Spotify(Keys.spotifyKeys);

		var spotifyParams = {
			type: 'track', 
			query: args.join(" "),
		};

		spotify.search(spotifyParams, function(err, data) {
			console.log("-------------------------------------------------------------------");
			console.log("Looking for '" + args.join(" ") + "'");
			if (!err) {
				var topSong = data.tracks.items[0]
				console.log("-------------------------------------------------------------------");
				console.log("Found a song!");
				console.log("-------------------------------------------------------------------");
				console.log("Song Name: " + topSong.name);
				console.log("Artist: " + topSong.artists[0].name);
				console.log("Album: " + topSong.album.name);
				console.log("Preview Link: " + topSong.preview_url);
				console.log("-------------------------------------------------------------------");

				//console.log(JSON.stringify(topSong, null, 2)); 
			} else {
				throw err
			}
		});
	}

	function omdbFetch() {
		if (!args || args.length === 0) {
			console.log("-------------------------------------------------------------------");
			console.log("Please input a movie to look up.");
			console.log('Otherwise, here is "Mr. Nobody".');
			args.push('Mr. Nobody');
		}

		var omdbAPIKey = Keys.omdbKeys.api_key;

		var queryUrl = "http://www.omdbapi.com/?t=" + args.join(" ") + "&y=&plot=short&apikey=" + omdbAPIKey;

		//console.log(queryUrl);

		Request(queryUrl, function (err, res, body) {
			console.log("-------------------------------------------------------------------");
			console.log("Looking for '" + args.join(" ") + "'");
			if(!err) {
				var retObj = JSON.parse(body);
				var rtRating = retObj.Ratings.filter(function( obj ) {
					return obj.Source == 'Rotten Tomatoes';
				})[0].Value || "No rating available";
				console.log("-------------------------------------------------------------------");
				//console.log(retObj.imdbRating);
				//console.log(retObj);
				console.log("Title: " + retObj.Title);
				console.log("Released in " + retObj.Year);
				console.log("IMDB rating: " + retObj.imdbRating);
				console.log("Rotten Tomatoes rating: " + rtRating);
				console.log("Made in: " + retObj.Year);
				console.log("Language: " + retObj.Language);
				console.log("Plot summary: " + retObj.Plot);
				console.log("Starring: " + retObj.Actors);
				console.log("-------------------------------------------------------------------");
			} else {
				throw err
			}
		});
	}

	function fromFile() {
		console.log("-------------------------------------------------------------------");
		console.log("Doing something from a file...");
		Fs.readFile('random.txt', 'utf-8', function(err, data) {
			console.log("-------------------------------------------------------------------");
			console.log("File says '" + data + "'");
			var args = data.split(",");
			doSomething(args);
		});
	}

}

function logRequest() {
	Fs.appendFile('log.txt', " \n"+args[0]+", "+args.slice(1,args.length).join(" ") + ", " + new Date(), function(err, data) {
	});
}

logRequest();
doSomething(args);