define(['pages/basepage', 'util', 'modules/common/dimensionList', 'modules/reportsChart', 'modules/reportsTable'], function (BasePage, Util, DimList, ReportsChart, ReportsTable) {

    "use strict";

    var View = BasePage.View.extend({
        pageId: 'my-reports',
        template: 'pages/myReports',

        afterRender: function () {
            this.renderPage();
            this.somethingElse();
        },
        somethingElse:function(){
            this.$('#clickme').on('click',function(e){
               console.log(e);
                e.preventDefault();

            });
        },

        renderPage: function () {

            var dimListEl = this.$('.dimension-list');
            dimListEl.empty();

            var chart1El = this.$('#chart1');
            chart1El.empty();


            var chart2El = this.$('#chart2');
            chart2El.empty();

            var table1El = this.$('#table1');
            table1El.empty();


            var table2El = this.$('#table2');
            table2El.empty();



            var dimList = new DimList.View();
            dimList.render().$el.appendTo(dimListEl);

            var chart1Model = new ReportsChart.Model({
                requestId: 'getGroupedData',
                params: app.getPageParamString(),
                yAxis:'collection'
            });

            var chart1 = new ReportsChart.View({
                model: chart1Model
            });

            chart1.render().$el.appendTo(chart1El)


            var chart2Model = new ReportsChart.Model({
                requestId: 'getGroupedData',
                params: app.getPageParamString(),
                yAxis:'ticketsSold'
            });

            var chart2 = new ReportsChart.View({
                model: chart2Model
            });

            chart2.render().$el.appendTo(chart2El)



            var table1Model = new ReportsTable.Model({
                requestId: 'getGroupedData',
                params: app.getPageParamString(),
                yAxis:'collection'
            });

            var table1 = new ReportsTable.View({
                model: table1Model
            });

            table1.render().$el.appendTo(table1El)


            /*
            var table2Model = new ReportsTable.Model({
                requestId: 'getGroupedData',
                params: app.getPageParamString(),
                yAxis:'ticketsSold'
            });

            var table2 = new ReportsTable.View({
                model: table2Model
            });

            table2.render().$el.appendTo(table2El)
            */


            this.model.on('change:dimension', function (model, dimension) {
                chart1Model.set('params', app.getPageParamString());
                chart2Model.set('params', app.getPageParamString());
                table1Model.set('params', app.getPageParamString());
                //table2Model.set('params', app.getPageParamString());
            });

        }



    });

    var Model = BasePage.Model.extend({
        defaults: {
            dimension: 'state'
        }
    });

    return {
        View: View,
        Model: Model
    };

});