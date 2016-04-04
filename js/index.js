function getSuggestions(query) {
  $.ajax({
    url: "https://en.wikipedia.org/w/api.php",
    jsonp: "callback",
    dataType: 'jsonp',
    data: {
      action: "query",
      list: "prefixsearch",
      pssearch: query,
      pslimit: "5",
      format: "json"
    },
    xhrFields: {
      withCredentials: true
    },
    success: showSuggestions,
    error: function(err) {
      console.log(err);
    }
  });

};

function showSuggestions(data) {
  var suggestList = [];

  for (var i = 0; i < data.query.prefixsearch.length; i++) {
    suggestList.push(data.query.prefixsearch[i].title);
  };
  $(".query").autocomplete({
    source: suggestList
  });

  $(".query").autocomplete("search");

}

function searchRequest(query) {
  $.ajax({
    url: "https://en.wikipedia.org/w/api.php",
    jsonp: "callback",
    dataType: 'jsonp',
    data: {
      action: "query",
      list: "search",
      srsearch: query,
      srinfo: "suggestion",
      srlimit: "9",
      format: "json"
    },
    xhrFields: {
      withCredentials: true
    },
    success: displayResults
  });
};

function displayResults(data) {
  $(".results").html("");
  $(".results").css({
    "opacity": 0,
    "top": "50px"
  });

  var resultsContents = "";
  for (var i = 0; i < data.query.search.length; i++) {
    var title = data.query.search[i].title;
    var url = "https://en.wikipedia.org/wiki/" + title;
    var snippet = data.query.search[i].snippet;
    resultsContents += "<a href='" + url + "' target='_blank'><div class='result-card'><h3>" + title + "</h3><p>" + snippet + "</p></div></a>";
  };
  $(".results").html(resultsContents);
  $(".results").animate({
    "opacity": 1,
    "top": "0px"
  }, 500);
};

$(document).ready(function() {
  var typingTimer;
  var doneTypingInterval = 500;
  //  $(".query").focus();
  // Tool-tip for the Random button.
  $(".random-button").hover(function() {
    var position = $(this).position();
    var height = $(this).height();
    $(".tt-random").css({
      top: position.top + height + "px",
      left: (position.left - ($(".tt-random").width() / 2) + 12) + "px"
    });
    $(".tt-random").fadeIn(300);
  }, function() {
    $(".tt-random").fadeOut(100);
  });
  // Tool-tip for the Search button.
  $(".search-button").hover(function() {
    var position = $(this).position();
    var height = $(this).height();
    $(".tt-search").css({
      top: position.top + height + "px",
      left: (position.left - ($(".tt-search").width() / 2) + 12) + "px"
    });
    $(".tt-search").fadeIn(300);
  }, function() {
    $(".tt-search").fadeOut(100);
  });
  // Call searchRequest on Search button click.
  $(".search-button").on("click", function() {
    searchRequest($(".query").val());
  });
  // Call searchRequest when user presses enter.
  $(".query").focus(function() {
    if (!$(this).val == "") {
      $(this).select();
    }
  });

  $(".query").keydown(function(e) {
    if (e.which == 8 || e.which == 46) {
      $(".results").html("");
      $(this).val = "";
    };
  });

  $(".query").keypress(function(e) {
    clearTimeout(typingTimer);
    if (e.which == 13) {
      searchRequest($(this).val());
      $(this).select();
      $(".ui-menu").hide();
    }
  });

  $(".query").on("input propertychange paste", function() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function() {
      if ($(".query").val().length > 1) {
        getSuggestions($(".query").val());
      };
    }, doneTypingInterval);

  });
});