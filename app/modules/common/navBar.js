/**
 * Created with JetBrains WebStorm.
 * User: ravi.hamsa
 * Date: 23/06/13
 * Time: 7:40 PM
 * To change this template use File | Settings | File Templates.
 */
define(['app', 'modules/base'],function(app,Base){

    var View = Base.View.extend({
        template:'common/reportsNavBar'
    });

    return {
        View:View
    }

});