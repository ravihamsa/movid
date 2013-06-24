/**
 * Created with JetBrains WebStorm.
 * User: ravi.hamsa
 * Date: 23/06/13
 * Time: 7:40 PM
 * To change this template use File | Settings | File Templates.
 */
define(['app', 'modules/baseData'],function(app,BaseData){

    var View = BaseData.View.extend({
        template:app.getTemplateFromString('<div class="chart-container"> </div>')
    });


    return {
        View:View,
        Model:BaseData.Model
    }

});