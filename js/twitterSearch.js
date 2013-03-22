/**
 * Created with JetBrains WebStorm.
 * User: elle
 * Date: 3/17/13
 * Time: 4:24 PM
 * To change this template use File | Settings | File Templates.
 */
;
(function() {
  $.fn.twitterSearch = function(conf) {
    var Twitter = {
      Models: {},
      Collections: {},
      Views: {},
      Helpers: {}
    };

    Twitter.options = {
      twittTemplate: "twitterTemplate",
      searchTemplate: "searchTemplate",
      twittTagName: "li",
      twittsTagName: "ul",
      searchTimeout: 0,
      animationTimeout: 0,
      searchDelay: 1000,
      updateDelay: 20000,
      animationSpeed: 600,
      animationDelay: 900,
      search: "USA",
      rpp: 30,
      result_type: 'recent',
      searchBar: false,
      fadeEffect: false,
      current: 0

    };

    var config;

    if(typeof conf === "string") {
      config = _.extend({}, Twitter.options, {search: conf});
    } else {
    config = _.extend({}, Twitter.options, conf);
    }

    //helper method to get template
    Twitter.Helpers.template = function(id) {
      return _.template($("#" + id).html())
    };

    Twitter.Helpers.FormatDate = function(str) {
      var date, dif, difDay, time, now;

      date = (new Date(str)).getTime();
      now = (new Date()).getTime();
      dif = Math.round((now - date) / 1000);
      difDay = Math.floor(dif / 86400);

      if (isNaN(difDay) || difDay < 0 || difDay > 31) {
        return;
      }

      time = (difDay === 0) ? (dif < 60) && 'just now' ||
          (dif < 120) && '1 min ago' ||
          (dif < 3600) && (Math.floor(dif / 60) + ' min ago') ||
          (dif < 7200) && 'an hour ago' ||
          (dif < 86400) && (Math.floor(dif / 3600) + ' hours ago') :
          (difDay === 1) && 'one day ago' ||
              (difDay < 7) && difDay + ' days ago' ||
              (difDay < 14) && 'a week ago' ||
              (difDay < 31) && (Math.floor(difDay / 7) + ' weeks ago');

      return time;

    };

    Twitter.Models.Twitt = Backbone.Model.extend({});

    Twitter.Views.Twitt = Backbone.View.extend({
      tagName: config.twittTagName,
      className: "twitt",
      template: Twitter.Helpers.template(config.twittTemplate),
      render: function() {
        var template = this.template(this.model.toJSON());
        this.$el.html(template);
        return this;
      }
    });

    Twitter.Collections.Twitts = Backbone.Collection.extend({
      model: Twitter.Models.Twitt,
      url: "http://search.twitter.com/search.json",
      parse: function(response) {
        $.each(response.results, this.formatTwitts);
        return  response.results;
      },

      formatTwitts: function(index, obj) {

        obj.text = obj.text.replace(/(http:[^\s]+)/g, ' <a href="$1">$1</a> ')
            .replace(/@([^\s:]+)/g, ' <a href="http://twitter.com/$1">@$1</a> ')
            .replace(/\s(#[^\s]+)/g, ' <a href="#">$1</a> ');

        obj.url = 'https://twitter.com/' + obj.from_user + '/status/' + obj.id_str;

        obj.time = Twitter.Helpers.FormatDate(obj.created_at);


      },
      updateResults: function() {
        var self = this;
        self.fetch({cash: false,
          data: {
            q: '@' + config.search,
            rpp: config.rpp,
            result_type: config.result_type,
            page: config.page
          },
          dataType: "jsonp",

          success: function() {
            clearTimeout(config.animationTimeout);
            setTimeout(function() {
              self.updateResults()
            }, config.updateDelay);
          }});
      }


    });

    Twitter.Views.Twitts = Backbone.View.extend({
      tagName: config.twittsTagName,
      className: "twitts",
      initialize: function() {
        this.collection.on('reset', this.render, this);
      },
      addOne: function(model) {
        var twittView = new Twitter.Views.Twitt({model: model});
        this.$el.append(twittView.render().el);
      },
      addAll: function() {
        config.current = 0;
        this.$el.empty();
        this.collection.forEach(this.addOne, this)
      },
      render: function() {
        var self = this;
        this.addAll();
        setTimeout(function() {
          self.twittsAnimation(0)
        }, 600);
        return this;
      },
      events: {
        'mouseover': "stopAnimation",
        'mouseleave': "startAnimation"
      },

      startAnimation: function(e) {
        this.twittsAnimation(config.current);
      },

      stopAnimation: function() {
        clearTimeout(config.animationTimeout);
      },

      twittsAnimation: function(val) {

        var self = this, curr = (val) ? val : 0,
            len = self.$el.children('li').length,
            height,
            $elem = self.$el.children('li').eq(curr);

        height = $elem.outerHeight();

        if (config.fadeEffect) {
          $elem.animate({opacity: 0}, config.animationSpeed, function() {
            $elem.animate({marginTop: -height}, config.animationSpeed);
          })
        }
        else {
          $elem.animate({marginTop: -height}, config.animationSpeed, function() {
            $elem.css({opacity: 0});
          });
        }


        if (++curr < len) {
          config.current = curr;
          config.animationTimeout = setTimeout(function() {
            self.twittsAnimation(curr)
          }, config.animationDelay);
        } else {
          self.stopAnimation();
        }


      }

    });

    Twitter.Views.Search = Backbone.View.extend({
      tagName: 'form',
      template: Twitter.Helpers.template("searchTemplate"),
      className: "searchBar",
      events: {
        "keyup #query": "searchTwitts",
        "keypress #query": "searchTwitts"
      },


      searchTwitts: function(e) {
        var self = this,
            value = this.$el.children("#query").val();
        if (e.which === 13) {
          e.preventDefault()
        }
        if (value.length >= 3) {
          if (config.searchTimeout) {
            clearTimeout(config.searchTimeout);
          }
          config.searchTimeout = setTimeout(function() {
            config.search = value;
            self.collection.updateResults();
          }, config.searchDelay);

        } else {
          clearTimeout(config.searchTimeout);
        }
      },
      render: function() {
        this.$el.html(this.template());
        return this;
      }
    });

    //new instances of collection and collection view
    var twitts = new Twitter.Collections.Twitts(),
        twittsView = new Twitter.Views.Twitts({collection: twitts}),
        queryView = new Twitter.Views.Search({collection: twitts});


    //append search bar and search results
    if (config.searchBar) {
      this.append(queryView.render().el);
    }
    else {
      var title = config.search,
          firstLetter = title.charAt(0).toUpperCase();
      title = title.replace(/^\w/, firstLetter);
      $('h1.searchTitle').html(title).show();
      twitts.updateResults();
    }

    this.append(twittsView.el);

    return this;
  }

}());

$('div.twitter').twitterSearch();