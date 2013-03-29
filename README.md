twitterSearch
=============


# Twitter Search Plugin using jQuery and Backbone

Twitter search plugin for working with Twitter Search API to get twitts correspond to the search  criteria on websites.
`$.fn.twitterSearch()` creates an `ul` list of twitts and appends them to the DOM. Also appends a header with a query or a search bar which allows your users search for different twitts frequently.
Includes different transition effects, pause-on-hover and auto-update features.
Getting Started
==================================================
Downloaddependence files: [underscore.js](http://underscorejs.org/) , [backbone.js](http://backbonejs.org/), [jquery-1.9.1.js](http://jquery.com/)

Download the [production version](#) or [development version](https://github.com/kozlitinaelja/twitterSearch/blob/master/js/twitterSearch.js) of twitter search plugin

Download [default styling](https://github.com/kozlitinaelja/twitterSearch/blob/master/twitter.css)

Add in your html file:
`
  &lt;div class="twitter"&rt;&lt;/div&rt;
  
  &lt;script src="js/underscore.js"&rt;&lt;/script&rt;
  
  &lt;script src="js/jquery-1.9.1.js"&rt;&lt;/script&rt;
  
  &lt;script src="js/backbone.js"&rt;&lt;/script&rt;
  
  &lt;script src="js/twitterSearch.js"&rt;&lt;/script&rt;
  
  &lt;script&rt;
  
    $("div.twitter").twitterSearch({search: "CNN", searchBar: false});
    
  &lt;/script&rt;`
  
Usage
============================
###Simple usage:
By simply passing a string performs a search with that string and provides basic configuration.
`$(selector).twitterSearch("monkey");`
Custom usage:
===============================
There are a lot of options can be specified by passing a configuration object into the plugin, so code can look like:
`
  $(selector).twitterSearch({
    //Sent from the user @bbcNews
    from: "bbcNews",
    //The number of tweets to return per page
    rpp: 30,
    // Specifies what type of search results you would prefer to receive (mixed, recent, popular)
    result_type: "recent",
    //Append the search bar
    searchBar: true,
    //Don't use fadeOut effect to twitts
    fadeEffect: false,
  });
`
Examples
===========================
You can find some examples at [twitter search examples](hhtps://kozlitinaelja.github.com/twitterSearch.html)
Documentation
===========================
Twitter search plugin provides jQuery collection method `$.fn.twitterSearch(options)`

*options:* string or objects defines search criteria and configuration

### Options you can override:

*searchBar:* Set true if you want to provide to your users ability to search frequently;

*placeholder:* If you set true to searchBar, you might want to provide an example search;

*fadeEffect:* Set true to use FadeOut effect during the animation process;

*search:* term you want to search for;

*from:* sent from the user;

*to:* sent to the user;

*rpp:* The number of tweets to return per page, up to a max of 100;

*result_type:* Optional. Specifies what type of search results you would prefer to receive. The current default is "recent." Valid values include: "mixed", "recent", "popular".

Authors
=============================
<a href="https://github.com/kozlitinaelja">Elnara Kozlitina</a>
