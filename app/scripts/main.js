// jshint devel:true

// load nytimes:
$(document).ready(function() {

  function mms_search(term){
    console.log('accepted ' + term);
    var search_url = 'http://mms-twitter-endpoint.herokuapp.com/twitter/' + encodeURI(term);
    console.log('searching ' + search_url);
    $.getJSON( search_url, function( data ) {
      console.log(data.results);
      $('.twitter_result').html('');

      for(i = 0; i < data.results.length; i++){
        console.log('rendering: ' + data.results[i]['text']);
        $('.twitter_result').append('<li class="list-group-item"><p class="tweet-text">'+data.results[i]['text']+'</p><span class="tweet-author">'+data.results[i]['user']['']+'</span></li>');
      }
    });
  }

  $('#search_terms').on('keypress', _.debounce(function(){
    var term = $('#search_terms').val();
    mms_search(term);
    nyt(term);
  }, 300));

});
