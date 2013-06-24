define(['app','pages/basepage'],function  (app, BasePage) {

    "use strict";

    var View = BasePage.View.extend({
        pageName:'Dashboard Page'
    });

    var Model = BasePage.Model.extend({

    });
    
    return {
        View:View,
        Model:Model
    };

});