define(['app',  'modules/base', 'modules/common/pageHeader','modules/common/navBar'], function (app,Base, PageHeader, NavBar) {

    "use strict";

    var View = Base.View.extend({
        pageId: 'base',
        constructor: function (options) {
            Base.View.call(this, options);
            this.renderHeader();
            this.renderNavItems();
            this.$el.addClass(this.pageId + '-page');
        },

        renderHeader:function(){
            var headerEl = $('.page-header');

            var header = new PageHeader.View();
            header.render().$el.appendTo(headerEl);

            var navBar = new NavBar.View();
            navBar.render().$el.appendTo(headerEl);
        },
        renderNavItems:function(){

        }

    });

    var Model = Base.Model.extend({

    });

    return {
        View: View,
        Model: Model
    };
});