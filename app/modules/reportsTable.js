/**
 * Created with JetBrains WebStorm.
 * User: ravi.hamsa
 * Date: 23/06/13
 * Time: 7:40 PM
 * To change this template use File | Settings | File Templates.
 */
define(['app', 'modules/base', 'modules/baseData', 'highcharts'],function(app,Base,BaseData){

    var colorList  =['#FF5300',	'#BF5E30',	'#A63600',	'#FF7E40',	'#FFA073']

    var getColor = function(){
        return colorList[Math.floor(Math.random()*colorList.length)];
    }

    var TableView = Base.View.extend({
        template:'common/reportsTable'
    })

    var View = BaseData.View.extend({
        template:app.getTemplateFromString('<div class="table-container"> </div>'),
        loadData:function(){
            var _this = this;
            return $.when(this.loadCollectionData(), this.loadTickedSoldData()).done(function(collData, ticketData){
                _this.data = Array.prototype.slice.call(arguments,0);
            })
        },

        loadCollectionData:function(){
            var def = $.Deferred();
            var _this = this;

            var done = function(resp){
                def.resolve(resp);
            };

            var failure = function(errors){
                def.reject(errors);
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
        loadTickedSoldData:function(){
            var def = $.Deferred();
            var _this = this;

            var done = function(resp){
                def.resolve(resp);
            };

            var failure = function(errors){
                def.reject(errors);
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
            var collectionData = data[0];
            var ticketData =  data[1];
            var attr = this.model.toJSON();
            var pageAttributess = app.getPageAttributes();
            var categoryId = '_id';
            var yAxis =attr.yAxis;

            var categories = _.map(collectionData, function (item) {
                    return item[categoryId];
                })


            var clonedCollectionData = _.clone(collectionData);
            var sortedCollectionData = _.sortBy(clonedCollectionData, function (item) {
                return -item[categoryId];
            });

            var formattedCollectionData =  _.map(sortedCollectionData, function(item){
                return item[yAxis];
            })

            var expectedCollectionData =  _.map(sortedCollectionData, function(item, index){
                var formattedValue = formattedCollectionData[index];

                var base = Math.pow(10,(''+formattedValue).length-1);
                var val= Math.ceil(formattedValue/base)*base;
                return val;
            })


            var differenceCollectionData = _.map(formattedCollectionData, function(value, index){
                return expectedCollectionData[index]-value;
            })

            var clonedTicketData = _.clone(ticketData);
            var sortedTicketData = _.sortBy(clonedTicketData, function (item) {
                return -item[categoryId];
            });

            var formattedTicketData =  _.map(sortedTicketData, function(item){
                return item[yAxis];
            })

            var expectedTicketData =  _.map(sortedTicketData, function(item, index){
                var formattedValue = formattedTicketData[index];

                var base = Math.pow(10,(''+formattedValue).length-1);
                var val= Math.ceil(formattedValue/base)*base;
                return val;
            })


            var differenceTicketData = _.map(formattedTicketData, function(value, index){
                return expectedTicketData[index]-value;
            })



            var rows = _.map(formattedCollectionData,function(value, index){
                var actualCollection = value;
                var expectedCollection = expectedCollectionData[index];
                var diffCollection = differenceCollectionData[index];

                var actualTicket = formattedTicketData[index];
                var expectedTicket = expectedTicketData[index];
                var diffTicket = differenceTicketData[index];

                return _.object(['dimension', 'actualCollection', 'expectedCollection','differenceCollection', 'actualTicket', 'expectedTicket','differenceTicket'], [categories[index],actualCollection, expectedCollection, diffCollection, actualTicket, expectedTicket, diffTicket])
            })


            var tableEl = this.$('.table-container');
            tableEl.empty();


            var table = new TableView({
                model: new Base.Model({
                    rows:rows,
                    dimension:app.getString(pageAttributess.dimension),
                    yLabel:app.getString(yAxis),
                    yLabel2:'Tickets Sold'

                })
            })

            table.render().$el.appendTo(tableEl);



        }
    });


    return {
        View:View,
        Model:BaseData.Model
    }

});