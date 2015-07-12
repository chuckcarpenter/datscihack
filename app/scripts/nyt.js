(function($) {
  "use strict";

  var key = '8dec959bf29e9a1ad8b6d1d993ce30c4:1:56264988';

  function search(query) {
    return $.get(
      "http://api.nytimes.com/svc/search/v2/articlesearch.json",
      {"q": query, "api-key": key, "sort": "newest", "fq": "source:(\"The New York Times\")"});
  }

  function nyt(query) {
    var tmpl = _.template( $('#nyt-articles-template').html() );
    return search(query).then(function(response) {
      $('#nyt-articles').html(tmpl({stories: response.response.docs}));
    });
  }

  window.nyt = nyt;

  $(document).ready(function() {
  });
})(jQuery);
