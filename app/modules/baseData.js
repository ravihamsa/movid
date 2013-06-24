/**
 * Created with JetBrains WebStorm.
 * User: ravi.hamsa
 * Date: 23/06/13
 * Time: 7:40 PM
 * To change this template use File | Settings | File Templates.
 */
define(['app', 'util','modules/base'],function(app,Util,Base){

    var View = Base.View.extend({
        dataEvents:{
            'change':'refreshData'
        },
        render:function(){
            var _this = this;
            this.beforeRender();
            this.renderTemplate().done(function(){
                _this.afterRender();
                _this.loadData().done(function(){
                    _this.afterDataRender();
                })
            });
            return this;
        },

        refreshData:function(event, model){
            var _this = this;
            var changeAttributes = model.changedAttributes();

            if(model.hasChanged('params')){
                _this.loadData().done(function(){
                    _this.afterDataRender();
                })
            }

        },
        loadData:function(){
            var def = $.Deferred();
            var _this = this;

            var done = function(resp){
                _this.data = resp;
                _this.afterDataRender.call(_this);
                def.resolve();
            };

            var failure = function(errors){
                console.log('error', errors);
                def.reject();
            }


            var attr = this.model.toJSON();

            this.model.addRequest({
                id:attr.requestId,
                params:this.getParams(),
                success:done,
                failure:failure
            });

            return def;


        },
        afterDataRender:function(){
            var data = this.data;
            this.$el.html(JSON.stringify(data));
        },
        getParams:function(){
            return Util.paramsToObject(this.model.get('params'));
        }
    });

    var Model = Base.Model.extend({
        defaults:{
            requestId:'dummy',
            params:''
        }
    });

    return {
        View:View,
        Model:Model
    }

});