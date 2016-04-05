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
		var parkingContainer = this.el.find('.parking-container');
		var parkingIndicator = this.el.find('.parking-indicator').empty();

		ParkingApp.Event.on(ParkingApp.Event.PARKING_TICK_EVENT, function(){
			parkingContainer.fadeIn();
			parkingIndicator.text(['Tiempo restante: ', ParkingApp.getTimeString()].join(''))
		});

		ParkingApp.Event.on(ParkingApp.Event.PARKING_ENDED_EVENT, function(){
			parkingContainer.fadeOut();
			parkingIndicator.empty();
		});

		this.el.find('[data-action=start-parking]').on('click', function(){
			if(ParkingApp.Parking){
				console.log('PARKING ALREADY STARTED');
				ParkingApp.app.modal({
					title:  'Atención',
					text: 'Ya tiene una sesión de estacionamiento activa.',
					verticalButtons: true,
					buttons: [
						{
							text: 'Cancelar'
						},
						{
							text: 'Iniciar nuevo estacionamiento',
							onClick: _.bind(ParkingApp.Event.trigger, ParkingApp.Event, ParkingApp.Event.PARKING_STARTNEW_EVENT)
						},
						{
							text: 'Adicionar tiempo',
							bold: true,
							onClick: _.bind(ParkingApp.Event.trigger, ParkingApp.Event, ParkingApp.Event.PARKING_ADDMORE_EVENT)
						},
					]
				});

			}else{
				ParkingApp.Event.trigger(ParkingApp.Event.PARKING_STARTNEW_EVENT);
			}
		});
	};

	return HomePage;
});