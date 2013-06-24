/**
 * Created with JetBrains WebStorm.
 * User: ravi.hamsa
 * Date: 04/04/13
 * Time: 12:25 AM
 * To change this template use File | Settings | File Templates.
 */

define(['app', 'handlebars'], function (app) {

    "use strict";

    var BaseView = Backbone.View.extend({
        constructor: function (options) {
            if (!this.model) {
                this.model = new BaseModel();
            }
            Backbone.View.call(this, options);
            this.bindDataEvents();
            this.bindLoadingEvents();
        },
        bindDataEvents: function () {
            if (this.model) {
                this._bindDataEvents(this.model);
            }
            if (this.collection) {
                this._bindDataEvents(this.collection);
            }
        },

        bindLoadingEvents: function () {
            var _this = this;
            if (this.model) {
                this.model.on('startLoading', function () {
                    _this.showLoading();
                });

                this.model.on('stopLoading', function () {
                    _this.hideLoading();
                });
            }

        },
        _bindDataEvents: function (modelOrCollection) {
            var eventList, _this;
            _this = this;
            eventList = this.dataEvents;
            return _.each(eventList, function (handler, event) {
                var events, handlers, splitter;
                splitter = /\s+/;
                handlers = handler.split(splitter);
                events = event.split(splitter);
                return _.each(handlers, function (shandler) {
                    return _.each(events, function (sevent) {
                        return modelOrCollection.on(sevent, function () {
                            var args = Array.prototype.slice.call(arguments);

                            if (_this[shandler]) {
                                //var debounced = _.debounce(_this[shandler], 10);
                                return _this[shandler].apply(_this, [sevent].concat(args));
                            } else {
                                throw shandler + ' Not Defined';
                            }
                        });
                    });
                });
            });
        },
        renderTemplate: function () {
            var def = $.Deferred();
            var _this = this;
            if (typeof this.template === 'string') {
                //check for template script element
                if (this.template.indexOf('/') === -1 && $('script#' + this.template).length > 0) {
                    this.template = app.getTemplateFromScriptTag(this.template);
                    this._renderTemplate();
                    def.resolve();
                } else {
                    var done = function (template) {
                        _this.template = template;
                        _this._renderTemplate.call(_this);
                        def.resolve();
                    };
                    app.getTemplateFromURL(this.template, done);

                }
            } else if (typeof this.template === 'function') {
                this._renderTemplate();
                def.resolve();
            } else {
                def.reject();
            }

            return def;
        },
        _renderTemplate: function () {
            this.$el.html(this.template(this.model.toJSON()));
        },
        beforeRender: function () {

        },
        afterRender: function () {

        },
        render: function () {
            var _this = this;
            this.beforeRender();
            this.renderTemplate().done(function () {
                _this.afterRender();
            });
            return this;
        },
        showLoading: function () {
            this.$el.addClass('loading');
        },
        hideLoading: function () {
            this.$el.removeClass('loading');
        },
        anchorHandler: function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $el = $(e.currentTarget);
            if ($el.hasClass('disabled') || $el.parent().hasClass('disabled')) {
                return;
            }
            var action = $el.attr("href");
            if (this.actionHandler) {
                this.actionHandler.call(this, action);
            }
        },
        navigateHandler: function (e) {
            e.preventDefault();
            //e.stopPropagation();
            var $el = $(e.currentTarget);
            var url = $el.attr("href");
            app.router.navigate(url, {trigger: true});
        },
        actionHandler: function (action) {
            console.log(action + ' is not handled');
        }
    });


    var BaseRequestModel = Backbone.Model.extend({
        idAttribute: 'ts',
        initialize: function () {
            _.bindAll(this);
        },
        load: function () {
            this.request = app.request({
                id: this.get('id'),
                params: this.get('params'),
                success: this.loadSuccess,
                failure: this.loadFailure,
                always: this.loadAlways
            });

        },
        loadSuccess: function () {
            //console.log('loadSuccess', arguments);
            var successCallback = this.get('success');
            if (successCallback) {
                successCallback.apply(this, arguments);
            }

        },
        loadFailure: function () {
            //console.log('loadFailure', arguments);
            var failureCallback = this.get('failure');
            if (failureCallback) {
                failureCallback.apply(this, arguments);
            }
        },
        loadAlways: function () {
            //console.log('loadAlways', arguments);
            if (this.collection) {
                this.collection.remove(this);
            }
        }
    });

    var BaseRequestCollection = Backbone.Collection.extend({
        initialize: function () {
            this.on('add', function (model) {
                model.load();
            });
        },
        model: BaseRequestModel
    });


    var BaseModel = Backbone.Model.extend({
        constructor: function (attributes, options) {
            var _this = this;

            this.requestCollection = new BaseRequestCollection();

            Backbone.Model.apply(this, arguments);

            this.requestCollection.on('add', function (model) {
                //console.log('add', this.length, model.id);
                if (this.length !== 0) {
                    _this.trigger('startLoading');
                }

            });

            this.requestCollection.on('remove', function (model) {
                //console.log('remove',  model.id);
                if (this.length === 0) {
                    _this.trigger('stopLoading', false);

                }
            });


            if (options && options.requests) {
                this.setupRequests(options.requests);
            }


        },
        setupRequests: function (configArr) {
            _.each(configArr, function (config) {
                this.addRequest(config);
            }, this);
        },
        addRequest: function (config) {
            config.ts = new Date().getTime();
            this.requestCollection.add(config);

        }
    });


    return {
        View: BaseView,
        Model: BaseModel
    };

});
