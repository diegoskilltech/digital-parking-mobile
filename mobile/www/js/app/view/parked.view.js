/**
 * Parking application view
 */
define(['jquery', 'underscore', 'handlebars', '../model/parking.model', '../model/codes.model'], function($, _, handlebars, parkingModel, codesModel){
	var config = codesModel.DEV;
	
	//Class definition
	var ParkingPage = function(page){
		console.log('PARKING PAGE LOADED -->');
		this.el = $(page.container);

		this.bindEvents();

		this.price = config.PRICE / 60;
		this.time = 0;
		this.total = 0;

	};

	//To bind interface events
	ParkingPage.prototype.bindEvents = function(){
		var self = this;

		self.el.find('[data-action=start-parking]').on('click', _.bind(self.onStartParking, self));

		self.el.find('[data-action=more-time]').on('click', _.bind(self.onCalculate, self, 1));
		self.el.find('[data-action=less-time]').on('click', _.bind(self.onCalculate, self, -1));

		//Display data
		self.el.find('.location').text(ParkingApp.Parking.location.description);
		self.el.find('.vehicle').text(ParkingApp.Parking.vehicle);

		var time = self.el.find('.remaning-time').text(ParkingApp.getTimeString());
		ParkingApp.Event.on(ParkingApp.Event.PARKING_TICK_EVENT, function(){
			time.text(ParkingApp.getTimeString());
		});
	};

	//To handle the add or remove time
	ParkingPage.prototype.onCalculate = function(multiplier){
		this.time += config.TIME * multiplier;
		this.time = this.time < 0 ? 0 : this.time;

		this.total = this.fixDecimals(this.time * this.price);

		this.el.find('.time').text(this.time);
		this.el.find('.price').text(this.total);
		this.el.find('.error-message').empty();
	};

	//To handle the start parking event
	ParkingPage.prototype.onStartParking = function(){
		console.log('ABOUT TO START PARKING...');

		var vehicle = ParkingApp.Parking.vehicle;
		var locationId = ParkingApp.Parking.locationId;

		var transactionId = 'TX1000';
		var parking = {time: this.time, amount: this.total * 100, vehicle: vehicle, locationId: locationId, transactionId: transactionId};

		console.log(parking);
		parkingModel
			.park(parking)
			.done(function(result){
				console.log(result);
			});

		ParkingApp.addMinutes(this.time);
	};


	//Helper to fix decimal numbers
	ParkingPage.prototype.fixDecimals = function(value){
		if(!value) return 0;
		return Math.round(value * 100) / 100;
	};

	return ParkingPage;
});