/**
 * Created with JetBrains WebStorm.
 * User: ravi.hamsa
 * Date: 04/04/13
 * Time: 12:19 AM
 * To change this template use File | Settings | File Templates.
 */
define(['app'],function(){

    "use strict";

    var Util = {};

    Util.paramsToObject = function(params){
        var obj = {};
        if(!params){
            return obj;
        }
        var paramsArray = _.map(params.split(';'),function(str){return str.split('=')});

        _.each(paramsArray,function(arr){
            obj[arr[0]]=arr[1];
        })
        return obj;
    }

    Util.objectToParams = function(obj){
        var str = [];

        _.each(obj, function(value, index){
            str.push(index+'='+value);
        });

        return str.join(';');
    }

    return Util;
})