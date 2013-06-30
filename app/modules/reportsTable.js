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
        afterDataRender:function(){
            var data = this.data;
            var attr = this.model.toJSON();
            var pageAttributes = app.getPageAttributes();
            var dimension = pageAttributes.dimension;
            var categoryId = '_id';
            var yAxis =attr.yAxis;

            var yLabel = app.getString(yAxis);


            var categories = ['collection', 'ticketsSold'];

            var xAxis = {
                categories: _.map(data, function (item) {
                    return item[categoryId];
                }),
                gridLineColor: '#ccc',
                gridLineDashStyle: 'shortdot',
                gridLineWidth: 1
            };




            var clonedData = _.clone(data);
            var sortedData = _.sortBy(clonedData, function (item) {
                return -item[categoryId];
            });
            //data = sortedData.splice(0, 10);

            var chartType = 'column';


            var formattedData =  _.map(sortedData, function(item){
                return item[yAxis];
            })

            var expectedData =  _.map(sortedData, function(item, index){
                var formattedValue = formattedData[index];

                var base = Math.pow(10,(''+formattedValue).length-1);
                var val= Math.ceil(formattedValue/base)*base;
                return val;
            })


            var differenceData = _.map(formattedData, function(value, index){
                return expectedData[index]-value;
            })


            var rows = _.map(formattedData,function(value, index){
                var expected = expectedData[index];
                var diff = differenceData[index];
                return _.object(['dimension', 'actual', 'expected','difference'], [xAxis.categories[index],value, expected, diff])
            })


            var tableEl = this.$('.table-container');
            tableEl.empty();


            var table = new TableView({
                model: new Base.Model({
                    rows:rows,
                    dimension:app.getString(dimension),
                    yLabel:yLabel
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