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
      timeOut: 0,
      searchDelay: 2000,
      search: "monkeys",
      rpp: 5,
      result_type: 'recent',
      updateSpeed: 10000

    };

    var config = _.extend({}, Twitter.options, conf);

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
        return
      }

      time = (difDay === 0) ? (dif < 60) && 'just now' ||
          (dif < 120) && 'minute ago' ||
          (dif < 3600) && (Math.floor(dif / 60) + ' minutes ago') ||
          (dif < 7200) && 'hour ago' ||
          (dif < 86400) && (Math.floor(dif / (60 * 60)) + ' hours ago') :
          (difDay === 1) && 'one day ago' ||
              (difDay < 7) && difDay + ' days ago' ||
              (difDay < 14) && 'one week ago' ||
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
        console.log(response.results);
        $.each(response.results, this.formatTwitts);
        return  response.results;
      },

      formatTwitts: function(index, obj) {

        obj.text = obj.text.replace(/(http:[^\s]+)/g, ' <a href="$1">$1</a> ')
            .replace(/@([^\s:]+)/g, ' <a href="http://twitter.com/$1">@$1</a> ')
            .replace(/\s(#[^\s]+)/g, ' <a href="#">$1</a> ');

        obj.url = 'https://twitter.com/' + obj.from_user + '/status/' + obj.id_str;

        obj.time = Twitter.Helpers.FormatDate(obj.created_at);


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
        this.$el.empty();
        this.collection.forEach(this.addOne, this)
      },
      render: function() {
        this.addAll();
        return this;
      }
    });

    Twitter.Views.Search = Backbone.View.extend({
      tagName: 'form',
      template: Twitter.Helpers.template("searchTemplate"),
      className: "searchBar",
      events: {
        "keyup #query": "searchTwitts"
      },
      updateResults: function() {
        var self = this;
        self.collection.fetch({cash: false,
          data: {
            q: '@' + config.search,
            rpp: config.rpp,
            result_type: config.result_type,
            page: config.page
          },
          dataType: "jsonp",

          success: function() {
            setTimeout(function() {
              self.updateResults()
            }, config.updateSpeed)
          }});
      },

      searchTwitts: function() {
        var self = this,
            value = this.$el.children("#query").val();

        if (value.length >= 3) {
          if (config.timeOut) {
            clearTimeout(config.timeOut);
          }
          config.timeOut = setTimeout(function() {
            config.search = value;
            console.log(value);
            self.updateResults();
          }, config.searchDelay);

        } else {
          clearTimeout(config.timeOut);
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
    this.append(queryView.render().el);
    this.append(twittsView.el);

    return this;
  }

}());

$('div.twitter').twitterSearch();
