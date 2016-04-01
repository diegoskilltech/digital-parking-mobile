/**
 * Home application view
 */
define(['jquery', 'underscore', 'handlebars', '../model/user.model'], function($, _, handlebars, userModel){
	
	//Class definition
	var HomePage = function(page){
		console.log('HOME PAGE LOADED -->');
		this.el = $(page.container);

		this.bindEvents();

		return this;
	};

	//To bind page element events
	HomePage.prototype.bindEvents = function(){
		var self = this;
		this.el.find('.user-name').text(ParkingApp.User.name);
		var parkingIndicator = this.el.find('.parking-indicator').empty();

		ParkingApp.Event.on(ParkingApp.Event.PARKING_TICK_EVENT, function(){
			parkingIndicator.text(['Tiempo restante: ', ParkingApp.getTimeString()].join(''))
		});

		ParkingApp.Event.on(ParkingApp.Event.PARKING_ENDED_EVENT, _.bind(parkingIndicator.empty, parkingIndicator));
	};

	return HomePage;
});