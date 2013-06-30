/**
 * Created with JetBrains WebStorm.
 * User: ravi.hamsa
 * Date: 23/06/13
 * Time: 7:40 PM
 * To change this template use File | Settings | File Templates.
 */
define(['app', 'modules/baseData', 'highcharts'],function(app,BaseData){

    var colorList  =['#FF5300',	'#BF5E30',	'#A63600',	'#FF7E40',	'#FFA073']


    var View = BaseData.View.extend({
        template:app.getTemplateFromString('<div class="chart-container" style="height:200px;"> </div>'),
        afterDataRender:function(){
            var data = this.data;
            var attr = this.model.toJSON();
            var categoryId = '_id';
            var yAxis =attr.yAxis;


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

            var color= colorList[Math.floor(Math.random()*colorList.length)]

            var series = [
                {
                    name:yAxis,
                    data: formattedData,
                    showInLegend: false,
                    color:color,
                    marker: {
                        fillColor: '#ffffff',
                        lineColor: '#1568b6',
                        lineWidth: 1,
                        radius: 4
                    }

                }
            ];


            var chartEl = this.$('.chart-container');
            chartEl.highcharts({
                chart: {
                    type: chartType
                },
                title: {
                    text: yAxis
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
                    min: 0,
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
                }
            });

        }
    });


    return {
        View:View,
        Model:BaseData.Model
    }

});