//app.js
define(['util', 'data/data', 'backbone', 'md5'], function (Util, Data) {

    "use strict";


    var hex_md5 = window.hex_md5;

    var requestIndex = {}, abortableRequestIndex = {}, queableRequestIndex = {};


    var app = {
        root: '/',
        pageNode: $('#main'),
        dataIndex:{},
        getPageModel: function () {
            return this.curPageView.model;
        },
        getPageAttributes: function () {
            return this.getPageModel().toJSON();
        },
        getPageParamString: function () {
            return Util.objectToParams(this.getPageAttributes());
        }
    };


    var dataUrlPrefix = 'http://ravihamsa.inmobi.com/api'; //without last slash

    var stringIndex = {
        collection:'Collection',
        ticketsSold:'Tickets Sold',
        state:'State',
        theatre_category:'Theatre Category',
        region:'Region',
        city:'City',
        district:'District',
        language:'Language',
        movie_name:'Movie Name',
        movieName:'Movie Name',
        theatre:'Theatre',
        screen:'Screen'
    };

    var JST ={};

    var compiledIdTemplateIndex = {};

    app.getString = function(str){
        return stringIndex[str] || str;
    };

    app.getTemplateFromString=function(str){
        return Handlebars.compile(str);
    };

    app.getTemplateFromScriptTag=function(sid){
        var template = compiledIdTemplateIndex[sid];
        if(template){
            return template;
        }else{
            template = compiledIdTemplateIndex[sid] = Handlebars.compile($.trim($('script#'+sid).html()));
            return template;
        }
    };

    app.getTemplateFromURL=function(url, done){
        var path =  'templates/'+url+'.html';
        var runningRequest = requestIndex[path];
        // Seek out the template asynchronously.
        if (runningRequest) {
            runningRequest.done(function (contents) {
                done(JST[path]);
            });
        } else {
            requestIndex[path] = $.get(path, function (contents) {
                delete requestIndex[path];
                done(JST[path] = Handlebars.compile(contents));
            });
        }
    };

    app.getPageURL = function (pageId, params) {
        return '#page/' + pageId + '/' + Util.objectToParams(params);
    }


    var getResp = function (requestId, dataObj, successHash) {
        var requestSettings = requestIndex[requestId];
        if (requestSettings.cache === "session" && app.store.get(successHash)) {
            return app.store.get(successHash);
        }
    };

    var getSuccessHash = function (requestId, dataObj) {
        return hex_md5(requestId + JSON.stringify(dataObj) + 'success');
    };

    app.getCachedData = function (args) {
        var successHash = getSuccessHash.call(null, args.id, args.params);
        return _.clone(app.store.get(successHash));
    };


    app.ajaxRequest = function (requestSettings, dataObj) {
        var settings = $.extend(true, {}, requestSettings, {
            contentType:"application/json"
        });

        if(settings.url.indexOf('http')===-1){
            settings.url = dataUrlPrefix+settings.url;
        }

        if (requestSettings.type.toLowerCase() === "post") {
            settings.data = JSON.stringify(dataObj);
            return $.ajax(settings);
        } else if (requestSettings.type.toLowerCase() === "form_post") {
            return $.post(settings.url, dataObj);
        } else {
            if (!_.isEmpty(dataObj)) {
                settings.url += "?" + $.param(dataObj);
            }
            return $.ajax(settings);
        }
    };


    app.request = function (requestConfig) {
        var requestId = requestConfig.id;

        if (!requestIndex[requestId]) {
            throw "Request with id: " + requestId + " is not defined";
        }
        var requestSettings = requestIndex[requestId];
        requestSettings.id = requestId;

        var successCallBack = requestConfig.success || _.identity;
        var errorCallBack = requestConfig.failure || _.identity;
        var alwaysCallBack = requestConfig.always || _.identity;

        var dataObj = requestConfig.params || {};


        app._request(requestSettings, dataObj, successCallBack, errorCallBack, alwaysCallBack);

    };

    app._request = function (requestSettings, dataObj, successCallBack, errorCallBack, alwaysCallBack) {

        var requestId = requestSettings.id;

        var parseSuccessResponse = function (resp) {


            if (requestSettings.cache === "session" && !_.isEmpty(resp)) {
                var successHash = hex_md5(requestSettings.requestId + JSON.stringify(dataObj) + 'success');
                app.store.set(successHash, resp);
                successCallBack.call(this, resp, requestSettings);
            } else {
                successCallBack.call(this, resp, requestSettings);
            }


            /*

            if (resp && resp.diagnostics) {
                if (resp.diagnostics.error && resp.diagnostics.error.length > 0) {
                    var parsedErrors = _.map(resp.diagnostics.error, function (error) {
                        return {
                            id: error.errorCode,
                            message: error.errorMessage
                        };
                    });
                    errorCallBack.call(this, resp, parsedErrors);
                } else if (resp.data) {
                    if (requestSettings.parser) {
                        resp.data = requestSettings.parser(resp.data);
                    }
                    if (requestSettings.cache === "session" && !_.isEmpty(resp.data)) {
                        var successHash = hex_md5(requestSettings.requestId + JSON.stringify(dataObj) + 'success');
                        app.store.set(successHash, resp.data);
                        successCallBack.call(this, resp.data, requestSettings);
                    } else {
                        successCallBack.call(this, resp.data, requestSettings);
                    }

                } else {
                    errorCallBack.call(this, resp, requestSettings);
                }
            } else {
                errorCallBack.call(this, resp, requestSettings);
            }

            */

        };

        var parseErrorResponse = function (resp) {
            errorCallBack.call(this, resp, requestSettings);
        };

        var successHash = getSuccessHash(requestId, dataObj);

        var cachedData = requestId !== undefined ? getResp(requestId, dataObj, successHash) : {};

        if (!_.isEmpty(cachedData)) {
            _.debounce(successCallBack, 100).call(null, cachedData, requestSettings);
            _.debounce(alwaysCallBack, 100).call(null, cachedData, requestSettings);
        } else {

            var runningRequest, request;

            if (requestSettings.queBehavior === 'abort') {
                runningRequest = abortableRequestIndex[successHash];
                if (runningRequest) {
                    runningRequest.abort();
                }
            }

            if (requestSettings.queBehavior === 'abort') {
                request = app.ajaxRequest(requestSettings, dataObj);
                abortableRequestIndex[successHash] = request;
                $.when(request).done(parseSuccessResponse).fail(parseErrorResponse).always(alwaysCallBack);
            } else if (requestSettings.queBehavior === 'que') {
                runningRequest = queableRequestIndex[successHash] = queableRequestIndex[successHash] || app.ajaxRequest(requestSettings, dataObj);
                $.when(runningRequest).done(parseSuccessResponse).fail(parseErrorResponse).always(alwaysCallBack);
            } else {
                $.when(app.ajaxRequest(requestSettings, dataObj)).done(parseSuccessResponse).fail(parseErrorResponse).always(alwaysCallBack);
            }


        }
    };


    app.request.define = function (requestId, type, settings) {
        settings.requestId = requestId;
        settings.requestType = type;
        requestIndex[requestId] = settings;
    };

    app.request.mockData = function (requestId, inputData, mockData) {
        var successHash = hex_md5(requestId + JSON.stringify(inputData) + 'success');
        app.store.set(successHash, mockData);
    };

    window.app = app;

    return  _.extend(app, {
        store: {
            set: function (key, value) {
                app.dataIndex[key] = value;
            },
            get: function (key) {
                return app.dataIndex[key];
            },
            remove: function (key) {
                app.dataIndex[key] = null;
                delete app.dataIndex[key];
            },
            list: function () {
                _.each(app.dataIndex, function (value, key) {
                    console.log(key, value);
                });
            }
        }

    }, Backbone.Events);
});