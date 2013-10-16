function movieLi(moviesObject){
  // display results of movie search: title and year
  // set up link via "data-id" to detailed display
  return $('<li class="result" data-id="' + moviesObject.imdbID +
'"><strong>' + moviesObject.Title + '</strong><em> ( ' + moviesObject.Year + ' )</em></li>');
}

function displayImage(movieObj) {
  // display the movie poster
  return $('<img  src="'+ movieObj["Poster"] + '"" alt="no picture on file">');
}

function displayData(movieKeys, data) {
  // display the detailed data {key, value} pairs from omdbapi
  return $('<div><span class="label">' + movieKeys +
    ':</span> <span class="value">' + data + '</span></div>');
}

function displayMovie() {
  // movie "id" from the "data-id" attribute in the movieLi function
  var movie = $(this).data();
  var movieKeys = ["Title", "Year", "Rated", "Runtime", "Genre",
  "Director", "Writer", "Actors", "Type", "Plot"]

  var result = $.ajax({
      // ajax call to opdbapi to get movie details
      url: "http://www.omdbapi.com",
      type: "get",
      data: {"i": movie.id},
      dataType: "jsonp",
      jsonpCallback: "movies"
    });

    result.done(function(data){
      // when ajax completes - display the movie details
      $('.input-form').hide();
      $('.results').hide();
      $moviePoster = displayImage(data);
      $('.image').append($moviePoster);
      for (var i = 0; i < movieKeys.length; i++) {
        $('.details').append( displayData(movieKeys[i], data[movieKeys[i]]) );
      }
      // $('.details').append('<button>Search Movies</button>')
    });
}

// TODO: use this function to start over
// function goToSearch() {
//   // reset divs to start over
//   $('.details').hide();
//   $('.image').hide();

//   $('.input-form').show();
//   $('.input-form input').val("");
// }

$(function() {
  //////////////////////
  // Delegates
  // get movie details on the selected title
  $('.results').on('click', 'li.result', displayMovie);


  /////////////////////
  // start search from button click inside form
  // TODO 1: be able to return to search for a new movie
  //        Idea: convert this to a delegate function
  //        button appears with the movie details - click to start over
  //        $('.details').on('click', 'button', goToSearch);
  // TODO 2: Make layout responsive
  $('form').on('submit', function(event) {
      event.preventDefault();
      var searchTerm = $('input').val();

      var omdb = $.ajax({
        // ajax call using search
        url: "http://www.omdbapi.com",
        type: "get",
        data: {"s": searchTerm},
        dataType: "jsonp",
        jsonpCallback: "movies"
      });

      omdb.done(function(data) {
        // when ajax completes - display the list of movies
         $('.input-form').hide();
        var movies = data["Search"];
        for( var i = 0; i < movies.length; i++) {
          var $movieTitle = movieLi(movies[i]);
          $('.results').append($movieTitle);
        }
      });
  }); // end of form code
});