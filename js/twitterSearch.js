/**
 * Created with JetBrains WebStorm.
 * User: elle
 * Date: 3/17/13
 * Time: 4:24 PM
 * To change this template use File | Settings | File Templates.
 */
;
(function () {
    $.fn.twitterSearch = function (conf) {
        var Twitter = {
            Models: {},
            Collections: {},
            Views: {},
            Helpers: {}
        };

        Twitter.options = {
            twittTemplate: "twitterTemplate",
            twittTagName: "li",
            twittsTagName: "ul"
        };

        var config = _.extend({}, Twitter.options, conf);

        //helper method to get template
        Twitter.Helpers.template = function (id) {
            return _.template($("#" + id).html())
        };

        Twitter.Models.Twitt = Backbone.Model.extend({});

        Twitter.Views.Twitt = Backbone.Model.extend({
            tagName: config.twittTagName,
            model: Twitter.Models.Twitt,
            template: Twitter.Helpers.template(config.twittTemplate),
            render: function () {
                var template = this.template(this.model.toJSON());
                this.$el.html(template);
            }
        });

        Twitter.Collections.Twitts = Backbone.Collection.extend({
            model: Twitter.Models.Twitt,
            url: "http://search.twitter.com/search.json",
            parse: function (responce) {
                return responce.results;
            }
        });

        Twitter.Views.Twitts = Backbone.View.extend({
            tagName: config.twittsTagName,
            initialize: function () {
                this.collection.on('reset', this.rebuild, this);
            },
            addOne: function () {
                var twittView = new Twitter.Views.Twitt({model: model});
                this.$el.append(twittView.render().el);
            },
            addAll: function () {
                this.collection.forEach(this.addOne, this)
            },
            render: function () {
                this.addAll();
            } ,
            //????
            rebuild: function() {
                this.$el.children().remove();
                this.render();
            }
        })
    }

}());