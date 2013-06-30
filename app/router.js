//router.js

define([ 'util', 'app','backbone'], function (Util, app) {

    "use strict";

    var Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            'page/:pageId/*params': 'loadPage',
            'page/:pageId': 'loadPage'

        },
        index: function () {
            app.router.navigate('page/myReports/', {trigger: true});
        },
        loadPage: function (pageId, params) {

            if(app.curPageId === pageId){
                app.curPageView.model.set(Util.paramsToObject(params));
                return;
            }

            require(["pages/" + pageId], function (Page) {
                var el = $('#main');
                el.empty();
                var paramsObject = Util.paramsToObject(params);
                paramsObject.pageId = pageId;

                var model = new Page.Model(paramsObject);
                var page = new Page.View({
                    model: model
                });
                el.append(page.render().el);
                app.curPageId = pageId;
                app.curPageView = page;
            });
        }
    });
    return Router;
});