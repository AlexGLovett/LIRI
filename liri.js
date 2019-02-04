var axios = require("axios");
var inquirer = require("inquirer");
var moment = require("moment");
var Spotify = require("node-spotify-api");
require("dotenv").config();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

//objects
var concerts = [];
var Concert = function(venue,date){
  this.venueName = venue.name;
  this.venueCountry = venue.country;
  this.venueCity = venue.city;
  this.venueState = venue.region;
  this.eventDate = date;
  this.print = function(){
    console.log("\x1b[34m","~~~~~~~~~~EVENT~~~~~~~~~~");
    console.log("\x1b[34m","~Venue Name: " + this.venueName);
    if (this.venueState !== "undefined"){
      console.log("\x1b[34m","~Venue Location: " + this.venueCity + ", " + this.venueState + "  " + this.venueCountry);
    }
    else{
      console.log("\x1b[34m","~Venue Location: " + this.venueCity + "  " + this.venueCountry);
    }
    console.log("\x1b[34m","~Concert Date: " + moment(this.eventDate).format("MM/DD/YYYY"));
    if (moment(this.eventDate).isAfter(moment())){
      console.log("\x1b[34m","~Time until this Event: " + moment(this.eventDate).diff(moment(),'days'));
    }
    else{
      console.log("\x1b[34m","~Time since this Event: " + moment().diff(moment(this.eventDate),'days') + " days");
    }
    console.log("\x1b[34m","~~~~~~~~~~~~~~~~~~~~~~~~~");
  }
  concerts.push(this);
}
var songs = [];
var Song = function(data){
  this.artists = data.artists[0].name;
  this.name = data.name;
  this.preview = data.external_urls.spotify;
  this.album = data.album.name;
  this.print = function(){
    console.log("~~~~~~~~~~SONG~~~~~~~~~~");
    console.log("~Artists: " + this.artists);
    console.log("~Track Title: " + this.name);
    console.log("~Preview Link: " + this.preview);
    console.log("~Album: " + this.album);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~");
  }
  songs.push(this);
}
var movies = [];
var Movie = function(data){
  
  this.title = data.Title;
  this.releaseYear = data.Year;
  this.imdbRating = data.imdbRating;
  this.rottenRating = "N/A";
  for (var i = 0; i < data.Ratings.length; i++){
    if (data.Ratings[i].Source === "Rotten Tomatoes"){
      this.rottenRating = data.Ratings[1].Value;
    }
  }
  this.country = data.Country;
  this.lang = data.Language;
  this.plot = data.Plot;
  this.actors = data.Actors;
  this.print = function(){
    console.log("\x1b[31m","~~~~~~~~~~Movie~~~~~~~~~~");
    console.log("\x1b[31m","~Title: " + this.title);
    console.log("\x1b[31m","~Release Year: " + this.releaseYear);
    console.log("\x1b[31m","~IMDB Rating: " + this.imdbRating);
    console.log("\x1b[31m","~Rotten Tomatoes Rating: " + this.rottenRating);
    console.log("\x1b[31m","~Country of Origin: " + this.country);
    console.log("\x1b[31m","~Language: " + this.lang);
    console.log("\x1b[31m","~Plot Summary: " + this.plot);
    console.log("\x1b[31m","~Actors: " + this.actors);
    console.log("\x1b[31m","~~~~~~~~~~~~~~~~~~~~~~~~~");
  }
  movies.push(this);
}
//Prompt the user for the search they want
//Perform axios search
//Format response to be printed
//print results
//log results



  function askLIRI(){
    inquirer.prompt([
      {
        type: "list",
        name: "request",
        message: "What would you like me to look for??",
        choices: ["Search for a Concert", "Search Spotify for a Song", "Search for a Movie", "Secret Function X", "Quit"]
      }
    ]).then(function(request) {  
      switch(request.request){
        case("Search for a Concert"):
        concertQuestion();
        break;
        case("Search Spotify for a Song"):
        spotifyQuestion();
        break;
        case("Search for a Movie"):
        movieQuestion();
        break;
        case("Secret Function X"):
        randomFunction();
        break;
        case("Quit"):
        console.log("Goodbye Dave.");
        process.exit(0);
        default:
        console.log("==============================================");
        console.log("I'm sorry, I can't let you do that, Dave.");
        console.log("==============================================");
        break;
      }
    });
  }

  function reset(){
    inquirer.prompt([
      {
        type: "confirm",
        name: "reset",
        message: "Would you like to perform another search?"
      }
    ]).then(function(reset) {
        if (reset.reset == true){
          concerts = [];
          movies = [];
          songs = []; 
          askLIRI(); 
        }
        else{ console.log("Goodbye, Dave."); }
    });
  }

  function concertQuestion(){
    inquirer.prompt([
      {
        type: "input",
        name: "searchTerm",
        message: "Who would you like to go see?"
      }
    ]).then(function(search) {
      axiosSearch("concert",search.searchTerm.split(' ').join('+'));
    });
  }

  function spotifyQuestion(){
    inquirer.prompt([
      {
        type: "input",
        name: "searchTerm",
        message: "What would you like me to look up on Spotify?"
      }
    
    ]).then(function(search) {
      spotifySearch(search.searchTerm.split(' ').join('+'), false);
    });
  }

  function movieQuestion(){
    inquirer.prompt([
      {
        type: "input",
        name: "searchTerm",
        message: "What movie would you like to learn about?"
      }
    
    ]).then(function(search) {
      
      axiosSearch("movie",search.searchTerm.split(' ').join('+'));
    });
  }

  function randomFunction(){
    var matrixText = "";
    for (var i = 0; i < 60; i++){ matrixText += "\n"; }
    matrixText += "███████╗███╗   ██╗████████╗███████╗██████╗     ████████╗██╗  ██╗███████╗    ███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗" + "\n";
    matrixText += "██╔════╝████╗  ██║╚══██╔══╝██╔════╝██╔══██╗    ╚══██╔══╝██║  ██║██╔════╝    ████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝" + "\n";
    matrixText += "█████╗  ██╔██╗ ██║   ██║   █████╗  ██████╔╝       ██║   ███████║█████╗      ██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ " + "\n";
    matrixText += "██╔══╝  ██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗       ██║   ██╔══██║██╔══╝      ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ " + "\n";
    matrixText += "███████╗██║ ╚████║   ██║   ███████╗██║  ██║       ██║   ██║  ██║███████╗    ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗" + "\n";
    matrixText += "╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝       ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝" + "\n";
    for (var i = 0; i < 30; i++){ matrixText += "\n"; }
    console.log('\x1b[32m',matrixText);
    setTimeout(function(){
      for (var i = 0; i < 10000; i++){
        var line = "";
        for (var j = 0; j < 220; j++){
          line += String.fromCharCode(Math.floor(Math.random()*97)+31);
          if (j === 219){ matrixText += line + '\n'; }
        }
      }
      console.log('\x1b[32m', matrixText);
      for (var i = 0; i < 20; i++){ console.log("\n"); }
      var loggingInArray = [];
      loggingInArray.push("██╗      ██████╗  ██████╗  ██████╗ ██╗███╗   ██╗ ██████╗     ██╗███╗   ██╗         ");
      loggingInArray.push("██║     ██╔═══██╗██╔════╝ ██╔════╝ ██║████╗  ██║██╔════╝     ██║████╗  ██║         ");
      loggingInArray.push("██║     ██║   ██║██║  ███╗██║  ███╗██║██╔██╗ ██║██║  ███╗    ██║██╔██╗ ██║         ");
      loggingInArray.push("██║     ██║   ██║██║   ██║██║   ██║██║██║╚██╗██║██║   ██║    ██║██║╚██╗██║         ");
      loggingInArray.push("███████╗╚██████╔╝╚██████╔╝╚██████╔╝██║██║ ╚████║╚██████╔╝    ██║██║ ╚████║██╗██╗██╗");
      loggingInArray.push("╚══════╝ ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝     ╚═╝╚═╝  ╚═══╝╚═╝╚═╝╚═╝");
      loggingInArray.push("resolving technobabble authentication servers...");
      loggingInArray.push("backtracing invading ip packages using fbi encryption keys...");
      loggingInArray.push("Success!");
      setTimeout(function(){ console.log(loggingInArray[0]); },500);
      setTimeout(function(){ console.log(loggingInArray[1]); },800);
      setTimeout(function(){ console.log(loggingInArray[2]); },1100);
      setTimeout(function(){ console.log(loggingInArray[3]); },1400);
      setTimeout(function(){ console.log(loggingInArray[4]); },1700);
      setTimeout(function(){ console.log(loggingInArray[5]); },2000);
      setTimeout(function(){ console.log(loggingInArray[6]); },2300);
      setTimeout(function(){ console.log(loggingInArray[7]); },2700);
      setTimeout(function(){ console.log(loggingInArray[8]); },5000);
      setTimeout(function(){
        for (var i=0; i<20; i++){ setTimeout(function(){ console.log('\n'); },500); }
        setTimeout(function(){
          console.log('=========================');
          fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) { return console.log(error); }
            var commands = data.split('\r\n');
            function Loop(commands,i,num){
              setTimeout(function(){
                if (commands[i] != "do-what-it-says"){
                  var command = commands[i].split(',')[0];
                  var term = commands[i].split(',')[1].replace(/"/g,'');
                  switch (command){
                    case("spotify-this-song"):
                      var _term = term;
                      spotifySearch(_term, true);
                    break;
                    case("movie-this"):
                      var _term = term;
                      axiosSearch("movie", _term, true);
                    break;
                    case("concert-this"):
                      var _term = term;
                      axiosSearch("concert", term, true);
                    break;
                  }
                }
                else{
                  console.log('\n');
                  console.log("\x1b[37m","Nice try. No recursive commands, thanks.");
                }
                if (--num){
                  i++;
                  console.log("~~~~~~~~~~~~~~~~~~~~~"); 
                  Loop(commands,i,num); 
                }
              },2000);
            }
            Loop(commands,0,commands.length)
          });
        },1000);
      },5100);
    },1000);
  }

  function tryAgain(questionType){
    inquirer.prompt([
      {
        type: "list",
        name: "request",
        message: "Would you like to this search again or start over?",
        choices: ["Retry This Search With a New Term", "Start Over", "Quit"]
        
      }
    ]).then(function(retry) {
        switch (retry.request){
          case("Retry This Search With a New Term"):
          concerts = [];
          songs = [];
          movies = [];
          questionType();
          break;
          case("Start Over"):
          concerts = [];
          songs = [];
          movies = [];
          askLIRI();
          break;
          case("Quit"):
          console.log("Goodbye Dave.")
          process.exit(0);
          break;
        }
    });
  }

  function presentOptions(resultsArray,presentMore,randBool){

    function more(arr, curr, length, increment, question){
      inquirer.prompt([
      {
        type: "confirm",
        name: "more",
        message: "Would you like to see more?"
      }
      ]).then(function(answer) {  
        if (answer.more == true){ 
          if (length - curr > increment){
            for (var i = curr; i < curr + increment; i++){ arr[i].print(); }
            more(arr, curr+increment, arr.length, increment, question);
          }
          else{
            for (var i = curr; i < length; i++){
              arr[i].print();
            }
            setTimeout(function(){
              tryAgain(question);
            },1000);
            
          }          
        }
        else{ setTimeout(function(){
          tryAgain(question);
          },1000); 
        }
      });
    }

    var array = "";
    var question = "";
    switch (resultsArray){
      case("concert"):
      array = concerts.slice();
      question = concertQuestion;
      break;
      case("song"):
      array = songs.slice();
      question = spotifyQuestion;
      break;
      case("movie"):
      array = movies.slice();
      question = movieQuestion;
      break;
    }

    if (array.length > 5){
      for (var i = 0; i < 5; i++){ array[i].print(); }
      if (presentMore == true && randBool == false){ more(array, 5, array.length, 5, question);}
    }
    else{
      for (var i = 0; i < array.length; i++){ array[i].print(); }
      if (randBool === false){ 
        setTimeout(function(){
          tryAgain(question);
        },1000); 
      }
    }
  }

  function spotifySearch(term,randBool){
    if (term == ""){
        term = "The+Sign%20artist:ace+of+base";
    }

    console.log("███████╗██████╗  ██████╗ ████████╗██╗███████╗██╗   ██╗    ███████╗███████╗ █████╗ ██████╗  ██████╗██╗  ██╗");
    console.log("██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝██║██╔════╝╚██╗ ██╔╝    ██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║");
    console.log("███████╗██████╔╝██║   ██║   ██║   ██║█████╗   ╚████╔╝     ███████╗█████╗  ███████║██████╔╝██║     ███████║");
    console.log("╚════██║██╔═══╝ ██║   ██║   ██║   ██║██╔══╝    ╚██╔╝      ╚════██║██╔══╝  ██╔══██║██╔══██╗██║     ██╔══██║");
    console.log("███████║██║     ╚██████╔╝   ██║   ██║██║        ██║       ███████║███████╗██║  ██║██║  ██║╚██████╗██║  ██║");
    console.log("╚══════╝╚═╝      ╚═════╝    ╚═╝   ╚═╝╚═╝        ╚═╝       ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝");
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("Searching Spotify for content related to " + term);
    spotify.search({ type: 'track', query: term }, function(err, data) {
      if (err) {
        spotifySearch("The Sign",false); 
      }
      else{
        for (var i = 0; i < data.tracks.items.length; i++){
          if (term == "The Sign"){
            if (data.tracks.items.artists[0].name.contains("Ace of Base")){
              var _track = new Song(data.tracks.items[i]);
            }
          }
          else{
            var _track = new Song(data.tracks.items[i]);
          }
        }
        if (data.tracks.items.length > 5){
          setTimeout(function(){
            if (randBool === true){ presentOptions("song",false, true); }
            else{ presentOptions("song", true, false); }
          },1000);
        }
        else{
          setTimeout(function(){
            if (randBool === true){presentOptions("song",false,true);}
            else{presentOptions("song",false,false);}
          },1000);
        }

      }
    });
  }

  function axiosSearch(type, term, randBool){
    var db = "";
    var question = "";
    switch (type){
      case("concert"):
      console.log('\n');
      console.log("\x1b[34m","~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log("\x1b[34m"," ██████╗ ██████╗ ███╗   ██╗ ██████╗███████╗██████╗ ████████╗    ███████╗███████╗ █████╗ ██████╗  ██████╗██╗  ██╗");
      console.log("\x1b[34m","██╔════╝██╔═══██╗████╗  ██║██╔════╝██╔════╝██╔══██╗╚══██╔══╝    ██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║");
      console.log("\x1b[34m","██║     ██║   ██║██╔██╗ ██║██║     █████╗  ██████╔╝   ██║       ███████╗█████╗  ███████║██████╔╝██║     ███████║");
      console.log("\x1b[34m","██║     ██║   ██║██║╚██╗██║██║     ██╔══╝  ██╔══██╗   ██║       ╚════██║██╔══╝  ██╔══██║██╔══██╗██║     ██╔══██║");
      console.log("\x1b[34m","╚██████╗╚██████╔╝██║ ╚████║╚██████╗███████╗██║  ██║   ██║       ███████║███████╗██║  ██║██║  ██║╚██████╗██║  ██║");
      console.log("\x1b[34m"," ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚══════╝╚═╝  ╚═╝   ╚═╝       ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝");
      console.log("\x1b[34m","~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      console.log("\x1b[34m","Searching for concerts featuring " + term);
      question = concertQuestion;
      db = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp";
      break;
      case("movie"):
      console.log("\x1b[31m"," ██████╗ ███╗   ███╗██████╗ ██████╗     ███╗   ███╗ ██████╗ ██╗   ██╗██╗███████╗    ███████╗███████╗ █████╗ ██████╗  ██████╗██╗  ██╗");
      console.log("\x1b[31m","██╔═══██╗████╗ ████║██╔══██╗██╔══██╗    ████╗ ████║██╔═══██╗██║   ██║██║██╔════╝    ██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║");
      console.log("\x1b[31m","██║   ██║██╔████╔██║██║  ██║██████╔╝    ██╔████╔██║██║   ██║██║   ██║██║█████╗      ███████╗█████╗  ███████║██████╔╝██║     ███████║");
      console.log("\x1b[31m","██║   ██║██║╚██╔╝██║██║  ██║██╔══██╗    ██║╚██╔╝██║██║   ██║╚██╗ ██╔╝██║██╔══╝      ╚════██║██╔══╝  ██╔══██║██╔══██╗██║     ██╔══██║");
      console.log("\x1b[31m","╚██████╔╝██║ ╚═╝ ██║██████╔╝██████╔╝    ██║ ╚═╝ ██║╚██████╔╝ ╚████╔╝ ██║███████╗    ███████║███████╗██║  ██║██║  ██║╚██████╗██║  ██║");
      console.log("\x1b[31m"," ╚═════╝ ╚═╝     ╚═╝╚═════╝ ╚═════╝     ╚═╝     ╚═╝ ╚═════╝   ╚═══╝  ╚═╝╚══════╝    ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝");
      console.log("\x1b[31m","Searching for movies with the title " + term);
      question = movieQuestion;
      db = "http://www.omdbapi.com/?t=" + term + "&apikey=trilogy";
      break;
    }
    axios.get(db)
    .then(function(response) { 
      var eventNum = response.data.length;
      if (eventNum < 1 || response.data == []){
        console.log(" I'm sorry. I couldn't find any " + type + "s for " + term + ".");
        if (randBool === false) { tryAgain(question); }
      }
      else if (type != "movie"){
        for (var i = 0; i < eventNum; i++){
          var _concert = new Concert(response.data[i].venue, response.data[i].datetime);
        }
        if (eventNum > 5){
          setTimeout(function(){
            if (randBool === true){ presentOptions(type,false, true); }
            else{ presentOptions(type, true, false); }
          },1000);
        }
        else{
          setTimeout(function(){
            if (randBool === true){presentOptions(type,false,true);}
            else{presentOptions(type,false,true);}
          },1000);
        }
      }
      else if (type == "movie"){
        var data = response.data;
        var _movie = new Movie(data);
        if (data != []){
          setTimeout(function(){
            if (randBool === false){ presentOptions(type,false,false); }
            else{ presentOptions(type,false,true); }
          },1000);
        }
      }
    })
    .catch(function(error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } 
      else if (error.request) { console.log(error.request); }
      else { console.log("Error", error.message); }
      console.log(error.config);
      if (randBool != true) { tryAgain(question); }
    });
  }

 if (process.argv.length == 2){ askLIRI(); }
 else{
   var args = process.argv;
   var term = "";
   for (var i = 3; i < args.length; i++){
    term += args[i] + '+';
   }
   term = term.substr(0, term.length -1);
   switch(args[2]){
     case("spotify-this-song"):
     spotifySearch(term,false);
     break;
     case("movie-this"):
     axiosSearch("movie", term, false);
     break;
     case("concert-this"):
     axiosSearch("concert", term, false);
     break;
     case("do-what-it-says"):
     randomFunction();
     break;
   }
 }