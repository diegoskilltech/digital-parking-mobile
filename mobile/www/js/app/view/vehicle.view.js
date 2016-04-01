/**
 * Vehicle application view
 */
define(['jquery', 'underscore', 'handlebars', '../model/vehicle.model', '../model/codes.model'], function($, _, handlebars, vehicleModel, codesModel){
	var config = codesModel.DEV;
	
	//Class definition
	var VehiclePage = function(page){
		console.log('VEHICLE PAGE LOADED -->');
		this.el = $(page.container);
		this.itemUl = this.el.find('#list-container').empty();

		this.vehicleTemplate = handlebars.compile(this.el.find('#vehicle-template').html() || 'VEHICLE TEMP');

		this.bindEvents();
		this.loadVehicles();
	};

	//To bind interface events
	VehiclePage.prototype.bindEvents = function(){
		var self = this;
		this.el.find('[data-action=add-vehicle]').on('click', _.bind(this.onAddVehicle, this));
		this.itemUl.on('click', '[data-action=del-vehicle]', function(){
			var vehicle = $(this).attr('_id');
			self.onRemoveVehicle(vehicle);
		})
	};

	//To handle the start parking event
	VehiclePage.prototype.onAddVehicle = function(){
		var self = this;
		ParkingApp.app.prompt('¿Cuál es la placa del vehículo?', 'Agregar vehículo', 
			function (value) {
				if(value){
					vehicleModel
						.post(value)
						.done(function(){
							self.loadVehicles();
						});

				}
			}
		);
	};

	//To handle the start parking event
	VehiclePage.prototype.onRemoveVehicle = function(vehicle){
		var self = this;
		ParkingApp.app.confirm('¿Confirma eliminar el vehículo ' + vehicle + '?', 'Eliminar vehículo', 
			function () {
				vehicleModel
					.del(vehicle)
					.done(function(){
						self.loadVehicles();
					});
			}
		);
	};

	//To load the locations and build the options
	VehiclePage.prototype.loadVehicles = function(){
		var template = this.vehicleTemplate;
		var el = this.itemUl;

		vehicleModel
			.get()
			.done(function(vehicles){
				el.empty().append(template(vehicles));
			});
	};

	return VehiclePage;
});