//Make ParkingApp globally available
define(['jquery', 'underscore', 'handlebars', './view/parking.view', './view/parked.view', './view/login.view', './view/home.view', './view/map.view', './view/vehicle.view', './view/history.view', './view/penalty.view', './model/user.model', './model/codes.model'], function($, _, handlebars, ParkingView, ParkedView, LoginView, HomeView, MapView, VehicleView, HistoryView, PenaltyView, UserModel, CodesModel){
	var config = CodesModel.DEV;

	_.extend(ParkingApp, {
		User: null,
		Parking: null,

		// Application Constructor
		initialize: function() {
			// Export selectors engine
			var $$ = Dom7;

			/* Initialize views */
			this.mainView = this.app.addView('.view-main', {
				dynamicNavbar: true
			});

			this.bindEvents();

			//this.app.showIndicator();
			UserModel.checkLoginStatus();
		},

		// Bind Event Listeners
		bindEvents: function() {
			//document.addEventListener('deviceready', _.bind(this.receivedEvent, this, null, 'Dispositivo preparado'), false);
			//document.addEventListener('volumedownbutton', _.bind(this.receivedEvent, this, null, 'call-emergency'), false);
			//ParkingApp.Event.on('log-message', _.bind(this.receivedEvent, this));

			var self = this;

			this.app.onPageBeforeInit('parking', function(page){new ParkingView(page)});
			this.app.onPageBeforeInit('parked', function(page){new ParkedView(page)});
			this.app.onPageBeforeInit('login', function(page){new LoginView(page)});
			this.app.onPageBeforeInit('home', function(page){new HomeView(page)});
			this.app.onPageBeforeInit('map', function(page){new MapView(page)});
			this.app.onPageBeforeInit('vehicle', function(page){new VehicleView(page)});
			this.app.onPageBeforeInit('history', function(page){new HistoryView(page)});
			this.app.onPageBeforeInit('penalty', function(page){new PenaltyView(page)});

			this.Event.on('user-logedin', function(){
				console.log('USER AUTHENTICATED - OK');
				self.mainView.router.load({url: 'home.html'});
				self.app.hidePreloader();
			});

			this.Event.on('user-notfound', function(){
				console.log('USER NOT LOGEDIN !!!!!');
				self.mainView.router.load({url: 'login.html'});
				self.app.hidePreloader();
			});

			this.Event.on(this.Event.PARKING_ADDMORE_EVENT, function(){
				self.mainView.router.load({url: 'parked.html'});
			});

			this.Event.on(this.Event.PARKING_STARTED_EVENT, _.bind(ParkingApp.Snoozer.onStart, ParkingApp.Snoozer));
		},

		//Helper to add more minutes to current parking session, or creates a new one if not exists
		addMinutes: function(minutes){
			//Check if it is a parking instance, if not, take it as minutes number
			if(!_.isNumber(minutes)){
				this.Parking = minutes;
				minutes = this.Parking.time;
				this.Parking.time = 0;
				this.Parking.seconds = 0;
			}

			this.Parking.time += minutes;
			this.Parking.seconds += minutes * 60;
			this.Event.trigger(this.Event.PARKING_STARTED_EVENT);
		},

		//Helper to get a human time rep
		getTimeString: function(){
			if(!this.Parking){
				return '0:00';
			}else{
				var min = Math.floor(ParkingApp.Parking.seconds / 60);
				var sec = String(ParkingApp.Parking.seconds % 60);
				sec = '00'.substr(sec.length) + sec;
				return [min, sec].join(':');
			}
		}
	});

	//Define the Event Dispatcher
	ParkingApp.Event = {
		PARKING_ADDMORE_EVENT: 'parking-add-more-time',

		PARKING_STARTED_EVENT: 'parking-started',
		PARKING_ENDED_EVENT: 'parking-ended',
		PARKING_TICK_EVENT: 'parking-tick',

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

	//Snoozer instance
	ParkingApp.Snoozer = {
		timer: null,
		next: 0,

		showModal: true,

		//Start snoozing event handler
		onStart: function(){
			//Check if there is already a Parking instance
			if(ParkingApp.Parking && !this.timer){
				//Check every second if we must snooze
				this.timer = setInterval(_.bind(this.check, this), 1000);
				ParkingApp.mainView.router.load({url: 'home.html'});
			}

			this.next = config.SNOOZE;
			this.showModal = true;
		},

		//Verify parking time every second
		check: function(){
			var parking = ParkingApp.Parking;
			if(parking){

				if(parking.seconds <= 0){
					console.log('PARKING ENDED');
					delete ParkingApp.Parking;
					ParkingApp.Event.trigger(ParkingApp.Event.PARKING_ENDED_EVENT);
				}else{
					parking.seconds --;
					ParkingApp.Event.trigger(ParkingApp.Event.PARKING_TICK_EVENT);

					this.checkSnooze(parking.seconds);
				}
			}else{
				clearInterval(this.timer);
				this.timer = null;
			}
		},

		checkSnooze: function(seconds){
			//If remaining seconds is less than the next snooze, alert
			if(seconds < this.next){
				console.log('SNOOZE');
				this.next -= Math.round(config.SNOOZE / 2);
				if(navigator.notification) {
					navigator.notification.vibrate(1500);
					navigator.notification.beep(1);
				}
				if(this.showModal) this.showSnooze();
			}
		},

		//To show a snooze modal
		showSnooze: function(){
			var self = this;
			var myApp = ParkingApp.app;

			myApp.modal({
				title:  'Atención',
				text: ['Restan', Math.round(ParkingApp.Parking.seconds / 60), 'minutos para finalizar el estacionamiento.'].join(' '),
				verticalButtons: true,
				buttons: [
					{
						text: 'Posponer'
					},
					{
						text: 'No avisar de nuevo',
						onClick: function() {
							self.showModal = false;
						}
					},
					{
						text: 'Adicionar tiempo',
						bold: true,
						onClick: _.bind(ParkingApp.Event.trigger, ParkingApp.Event, ParkingApp.Event.PARKING_ADDMORE_EVENT)
					},
				]
			});
		}
	};

	return ParkingApp;
});