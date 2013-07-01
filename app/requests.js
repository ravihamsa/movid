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

    app.dataIndex = {"e277470bd500bcb3f8c2706ccb122615":[{"_id":"region01","collection":44275,"ticketsSold":525},{"_id":"region11","collection":50125,"ticketsSold":704},{"_id":"region10","collection":76525,"ticketsSold":1004},{"_id":"region00","collection":96925,"ticketsSold":1109}],"b2285aa5590c9f241cae8081d9e3cebe":[{"_id":"state1","collection":126650,"ticketsSold":1708},{"_id":"state0","collection":141200,"ticketsSold":1634}],"31ce2046a4650d3509efe105f0bfd3e6":[{"_id":"district111","collection":19300,"ticketsSold":258},{"_id":"district010","collection":39025,"ticketsSold":474},{"_id":"district011","collection":5250,"ticketsSold":51},{"_id":"district110","collection":30825,"ticketsSold":446},{"_id":"district101","collection":50100,"ticketsSold":662},{"_id":"district100","collection":26425,"ticketsSold":342},{"_id":"district001","collection":32425,"ticketsSold":339},{"_id":"district000","collection":64500,"ticketsSold":770}],"29d43b8182001c597029665286d6ee4c":[{"_id":"city1111","collection":3025,"ticketsSold":39},{"_id":"city0101","collection":21350,"ticketsSold":251},{"_id":"city1110","collection":16275,"ticketsSold":219},{"_id":"city1010","collection":15300,"ticketsSold":227},{"_id":"city1101","collection":11575,"ticketsSold":171},{"_id":"city0010","collection":26050,"ticketsSold":262},{"_id":"city1000","collection":26425,"ticketsSold":342},{"_id":"city0011","collection":6375,"ticketsSold":77},{"_id":"city1011","collection":34800,"ticketsSold":435},{"_id":"city0110","collection":5250,"ticketsSold":51}],"0a771c0db69a52a134450f19cfea6330":[{"_id":"language3","collection":77750,"ticketsSold":1014},{"_id":"language1","collection":47950,"ticketsSold":592},{"_id":"language4","collection":52675,"ticketsSold":641},{"_id":"language2","collection":38550,"ticketsSold":438},{"_id":"language5","collection":50925,"ticketsSold":657}],"bec9fc96d735289ab8406164e5fb1621":[{"_id":"movieName1","collection":30950,"ticketsSold":455},{"_id":"movieName9","collection":16500,"ticketsSold":208},{"_id":"movieName3","collection":26450,"ticketsSold":322},{"_id":"movieName7","collection":40550,"ticketsSold":464},{"_id":"movieName6","collection":27600,"ticketsSold":345},{"_id":"movieName5","collection":19800,"ticketsSold":229},{"_id":"movieName10","collection":30525,"ticketsSold":383},{"_id":"movieName2","collection":19925,"ticketsSold":250},{"_id":"movieName4","collection":25000,"ticketsSold":314},{"_id":"movieName8","collection":30550,"ticketsSold":372}],"281e62fe389e16ab2eb9e32fcbd34d30":[{"_id":"theatre_category2","collection":33000,"ticketsSold":419},{"_id":"theatre_category1","collection":65200,"ticketsSold":850},{"_id":"theatre_category0","collection":169650,"ticketsSold":2073}],"2a12c7a752faa5f8fd22d214bd974f77":[{"_id":"theater2","collection":42275,"ticketsSold":531},{"_id":"theater1","collection":90350,"ticketsSold":1145},{"_id":"theater0","collection":135225,"ticketsSold":1666}],"8bca2025696772494b8995de852b9dda":[{"_id":"screen1","collection":38175,"ticketsSold":785},{"_id":"screen3","collection":141000,"ticketsSold":1404},{"_id":"screen2","collection":88675,"ticketsSold":1153}]}

    app.request.define("getGroupedData", "ajax", {
        url : "/transactions/grouped",
        type : "get",
        contentType : "json",
        queBehavior:queBehavior,
        cache:cacheType
    });

});