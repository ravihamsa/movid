/**
 * Created with JetBrains WebStorm.
 * User: ravi.hamsa
 * Date: 23/06/13
 * Time: 7:40 PM
 * To change this template use File | Settings | File Templates.
 */
define(['app', 'modules/base'],function(app,Base){

    var View = Base.View.extend({
        template:'common/reportsNavBar',
        events:{
            'click .navbar-inner a':'navHandler'
        },
        navHandler:function(e){
            var target = $(e.currentTarget);
            var href = target.attr('href');
            var pageId = href.substr(0, href.length-5);
            e.preventDefault();
            var url = app.getPageURL(pageId, {})
            app.router.navigate(url, {trigger: true});

        }
    });

    return {
        View:View
    }

});