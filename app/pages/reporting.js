define(['pages/basepage'],function  (BasePage) {

    "use strict";

    var View = BasePage.View.extend({
        pageName:'Reporting Page'
    });

    var Model = BasePage.Model.extend({

    });
    
    return {
        View:View,
        Model:Model
    };

});