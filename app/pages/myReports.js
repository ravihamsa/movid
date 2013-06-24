define(['pages/basepage', 'util', 'modules/common/dimensionList', 'modules/reportsChart'], function (BasePage, Util, DimList, ReportsChart) {

    "use strict";

    var View = BasePage.View.extend({
        pageId: 'my-reports',
        template: 'pages/myReports',
        afterRender: function () {
            this.renderPage();
        },
        renderPage: function () {

            var dimListEl = this.$('.dimension-list');
            dimListEl.empty();

            var chart1El = this.$('#chart1');
            chart1El.empty();


            var chart2El = this.$('#chart2');
            chart2El.empty();

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


            this.model.on('change:dimension', function (model, dimension) {
                chart1Model.set('params', app.getPageParamString());
                chart2Model.set('params', app.getPageParamString());
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