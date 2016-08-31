/**
 * Map application view
 */
define(['jquery', 'underscore', 'handlebars', '../model/parking.model'], function($, _, handlebars, parkingModel){
	
	//Class definition
	var MapPage = function(page){
		console.log('MAP PAGE LOADED -->');
		this.el = $(page.container);

		this.bindEvents();

		return this;
	};

	//To bind page element events
	MapPage.prototype.bindEvents = function(){
		var self = this;
		this.el.find('.user-name').text(ParkingApp.User.name);

		var mapOptions = {
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		};

		this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		this.carMarker = new google.maps.Marker({
				icon: 'img/car-icon.png',
				map: this.map
			});

		parkingModel
			.getCurrentPosition()
			.done(_.bind(this.onLocationChange, this), _.bind(console.warn, console));

		parkingModel
			.getFreeLocations()
			.done(_.bind(this.onLocations, this));
	};

	//Location change event handler
	MapPage.prototype.onLocationChange = function(position){
		var geo = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		this.map.setCenter(geo);
		this.carMarker.setPosition(geo);
	};

	//To plot free locations markers
	MapPage.prototype.onLocations = function(locations){
		var self = this;
		_.each(locations, function(point){
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(point.lat, point.lon),
				map: self.map
			});
		});
	}

	return MapPage;
});