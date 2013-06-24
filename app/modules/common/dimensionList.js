/**
 * Created with JetBrains WebStorm.
 * User: ravi.hamsa
 * Date: 23/06/13
 * Time: 7:40 PM
 * To change this template use File | Settings | File Templates.
 */
define(['app', 'modules/base'],function(app,Base){

    var View = Base.View.extend({
        template:'common/dimensionList',
        events:{
            'click a':'anchorHandler'
        },
        actionHandler:function(action){
            var pageModel = app.getPageModel();
            pageModel.set('dimension', action);
            var url = app.getPageURL('myReports', app.getPageAttributes())
            app.router.navigate(url);
        },
        afterRender:function(){
            var pageModel = app.getPageModel();
            pageModel.on('change:dimension', this.updateTabSelection, this);
            this.updateTabSelection();
        },
        updateTabSelection:function(){
            this.$('.active').removeClass('active');
            var pageModel = app.getPageModel();
            var dimension = pageModel.get('dimension');
            this.$('a[href="'+dimension+'"]').closest('li').addClass('active');
        }
    });

    return {
        View:View
    }

});