/**
 * Parking application view
 */
define(['jquery', 'underscore', 'handlebars', '../model/parking.model', '../model/vehicle.model', '../model/codes.model'], function($, _, handlebars, parkingModel, vehicleModel, codesModel){
	var config = codesModel.DEV;
	
	//Class definition
	var ParkingPage = function(page){
		console.log('PARKING PAGE LOADED -->');
		this.el = $(page.container);
		this.locationTemplate = handlebars.compile(this.el.find('#location-template').html() || 'LOCATION TEMP');
		this.vehicleTemplate = handlebars.compile(this.el.find('#vehicle-template').html() || 'VEHICLE TEMP');

		this.scanTimeOut = null;
		this.bindEvents();

		this.locations = [];
		this.price = config.PRICE / 60;
		this.time = 0;
		this.total = 0;

		this.loadFreeLocations();
		this.loadVehicles();
	};

	//To bind interface events
	ParkingPage.prototype.bindEvents = function(){
		this.el.find('[data-action=scan-location-code]').on('click', _.bind(this.onScan, this));
		this.el.find('[data-action=start-parking]').on('click', _.bind(this.onStartParking, this));

		this.el.find('[data-action=more-time]').on('click', _.bind(this.onCalculate, this, 1));
		this.el.find('[data-action=less-time]').on('click', _.bind(this.onCalculate, this, -1));
	};

	//Hanlde the scan code event
	ParkingPage.prototype.onScan = function(){
		var self = this;
		var el = this.el;

		console.log('SCAN CODE CLICKED!!!!!!');
		if(navigator.notification) navigator.notification.vibrate(500);

		try{
			if(!self.scanTimeOut){

				self.scanTimeOut = true;
				cordova.plugins.barcodeScanner.scan(
					function (result) {
						console.log("We got a barcode\n" +
						"Result: " + result.text + "\n" +
						"Format: " + result.format + "\n" +
						"Cancelled: " + result.cancelled);

						self.scanTimeOut = null;
						if(result.text){
							try{
								var qr = JSON.parse(result.text);
								//(self.locations || []).push(qr);
								el.find("[name=location]").append(self.locationTemplate([qr]));
							}catch(err){
								console.error(err);
							}
							
						}
					}, 
					function (error) {
						alert("Scanning failed: " + error);
						self.scanTimeOut = null;
					}
				);
			}
		}catch(err){
			console.error(err);
		}
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

		var vehicle = this.el.find('[name=vehicle]').val();
		var locationId = this.el.find('[name=location]').val();
		var location = _.findWhere(this.locations, {id: parseInt(locationId)});
		var transactionId = 'TX1000';

		var parking = {time: this.time, amount: this.total * 100, vehicle: vehicle, locationId: locationId, location: location, transactionId: transactionId};
		console.log(parking);
		if(!parking.time){
			this.el.find('.error-message').text('Debes indicar el tiempo');
		}else{
			parkingModel
				.park(parking)
				.done(function(result){
					console.log(result);
				});

			ParkingApp.addMinutes(parking);
		}
	};

	//To load the locations and build the options
	ParkingPage.prototype.loadFreeLocations = function(){
		var self = this;
		var template = this.locationTemplate;
		var el = this.el;

		parkingModel
			.getFreeLocations()
			.done(function(locations){
				self.locations = locations;
				el.find('[name=location]')
					.empty()
					.append(template(locations));
			});
	};

	//To load the locations and build the options
	ParkingPage.prototype.loadVehicles = function(){
		var template = this.vehicleTemplate;
		var el = this.el;

		vehicleModel
			.get()
			.done(function(vehicles){
				el.find('[name=vehicle]')
					.empty()
					.append(template(vehicles));
			});
	};

	//Helper to fix decimal numbers
	ParkingPage.prototype.fixDecimals = function(value){
		if(!value) return 0;
		return Math.round(value * 100) / 100;
	};

	return ParkingPage;
});