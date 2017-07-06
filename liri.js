var Twitter = require('twitter');
var Keys = require('./keys.js');
var Request = require('request');
var Spotify = require('node-spotify-api');

var operation = process.argv[2].toLowerCase();
var subsequentArgs = [];

function doSomething(operation) {

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
		doSomething();
		break;
		default: 
		console.log("Sorry, current build only accepts 4 commands: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'].");
	}

	function twitterFetch() {

		console.log("Trying to grab tweets");

		var twitterKeys = Keys.twitterKeys;

		var client = new Twitter({
			consumer_key: twitterKeys.consumer_key,
			consumer_secret: twitterKeys.consumer_secret,
			access_token_key: twitterKeys.access_token_key,
			access_token_secret: twitterKeys.access_token_secret
		});

		var params = {screen_name: 'nodejs'};
		// client.get('statuses/user_timeline', params, function(error, tweets, response) {
		// 	if (!error) {
		// 		console.log(tweets);
		// 	}
		// });
	}

	function spotifyFetch() {

	}

	function omdbFetch() {

	}

}