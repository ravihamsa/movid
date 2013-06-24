//main.js

require.config({
	appDir:'',
	baseUrl:'app/',
	paths:{
		'jquery':'../libs/jquery.min',
		'backbone':'../libs/backbone-min',
		'underscore':'../libs/underscore-min',
		'handlebars':'../libs/handlebars',
        'md5':'../libs/md5-min',
        'highcharts':'../libs/highcharts'
	},
	shim:{
		'backbone':['jquery','underscore']
	},
	modules:[
		{name:'main'}
	]
});


require(['app', 'router', 'requests'],function(app, Router){
	//$('body').html(_.map([1,2,3,4,5],function(number){return number*number}).join('-----'));
    "use strict";

	app.router = new Router();

	Backbone.history.start({
		root:app.root
	});
});

