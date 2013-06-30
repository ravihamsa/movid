/**
 * Created with JetBrains WebStorm.
 * User: ravi.hamsa
 * Date: 23/06/13
 * Time: 7:40 PM
 * To change this template use File | Settings | File Templates.
 */
define(['app', 'modules/baseData', 'highcharts'],function(app,BaseData){

    var colorList  =['#FF5300',	'#BF5E30',	'#A63600',	'#FF7E40',	'#FFA073']

    var getColor = function(){
        return colorList[Math.floor(Math.random()*colorList.length)];
    }

    var View = BaseData.View.extend({
        template:app.getTemplateFromString('<div class="chart-container" style="height:200px; border: 1px solid #efefef; margin-bottom: 20px;"> </div>'),
        afterDataRender:function(){
            var data = this.data;
            var attr = this.model.toJSON();
            var pageAttributess = app.getPageAttributes();
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


            var series = [
                {
                    name:'expected'+yAxis,
                    data: expectedData,
                    showInLegend: false,
                    color:'#6296c7',
                    marker: {
                        fillColor: '#ffffff',
                        lineColor: '#1568b6',
                        lineWidth: 1,
                        radius: 4
                    },
                    stack:'expected'

                },
                {
                    name:yAxis,
                    data: formattedData,
                    showInLegend: false,
                    color:'#00b866',
                    marker: {
                        fillColor: '#ffffff',
                        lineColor: '#1568b6',
                        lineWidth: 1,
                        radius: 4
                    },
                    stack:'actual'

                },
                {
                    name:'diff'+yAxis,
                    data: differenceData,
                    showInLegend: false,
                    color:'#ff2a1a',
                    marker: {
                        fillColor: '#ffffff',
                        lineColor: '#1568b6',
                        lineWidth: 1,
                        radius: 4
                    },
                    stack:'difference'

                }
            ];

            var chartEl = this.$('.chart-container');
            chartEl.highcharts({
                chart: {
                    type: chartType
                },
                title: {
                    text: ''+ yLabel +' by '+ app.getString(pageAttributess.dimension),
                    align: 'left',
                    style:{
                        color:'#333'
                    }
                },
                xAxis: xAxis,
                yAxis: {
                    title: {
                        text: ''
                    },
                    plotLines: [
                        {
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }
                    ],
                    gridLineColor: '#ccc',
                    gridLineDashStyle: 'shortdot'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -10,
                    y: 100,
                    borderWidth: 0
                },
                series: series,
                credits: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                }
            });

        }
    });


    return {
        View:View,
        Model:BaseData.Model
    }

});