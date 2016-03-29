//Make ParkingApp globally available
var ParkingApp = null;

define(['jquery', 'underscore', 'handlebars', './view/parking.view'], function($, _, handlebars, ParkingView){

	ParkingApp = {
		//F7 app container
		app: null,

		log: $('#log'),

		status: {
			1: handlebars.compile($('#status-sent-template').html() || 'SENT NOT FOUND'),
			2: handlebars.compile($('#status-read-template').html() || 'READ NOT FOUND')
		},

		// Application Constructor
		initialize: function() {
			this.app = app = new Framework7({material: true});

			// Export selectors engine
			var $$ = Dom7;

			/* Initialize views */
			var mainView = app.addView('.view-main', {
				dynamicNavbar: true
			});

			this.bindEvents();

		},

		// Bind Event Listeners
		bindEvents: function() {
			//document.addEventListener('deviceready', _.bind(this.receivedEvent, this, null, 'Dispositivo preparado'), false);
			//document.addEventListener('volumedownbutton', _.bind(this.receivedEvent, this, null, 'call-emergency'), false);
			//ParkingApp.Event.on('log-message', _.bind(this.receivedEvent, this));

			this.app.onPageBeforeInit('parking', function(page){new ParkingView(page)});

			var mapOptions = {
				zoom: 15,
				center: {lat: -34.397, lng: 150.644},
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true
			};

			var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		}
	};

	//Define the Event Dispatcher
	ParkingApp.Event = {
		listener: $({}),

		//To bind an event handler
		on: function(event, handler){
			this.listener.on(event, handler);
		},

		//To trigger a custom event
		trigger: function(event, data){
			this.listener.trigger(event, data);
		}
	};

	return ParkingApp;
});