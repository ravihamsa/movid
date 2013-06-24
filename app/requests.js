/**
 * Created with JetBrains WebStorm.
 * User: ravi.hamsa
 * Date: 04/04/13
 * Time: 1:18 AM
 * To change this template use File | Settings | File Templates.
 */
define(["app"], function(app) {

    "use strict";



    //session only as of now
    var cacheType = "session";


    //que/override/abort
    var queBehavior = "que";

    app.request.define("getGroupedData", "ajax", {
        url : "/transactions/grouped",
        type : "get",
        contentType : "json",
        queBehavior:queBehavior
    });

    app.request.define("getDashboardReport", "ajax", {
        url : "/advertiser/v2/updateadgroupbid.html",
        type : "POST",
        contentType : "json"
    });


});