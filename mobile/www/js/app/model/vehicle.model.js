/**
 * USER MODEL
 */
define(['jquery', 'underscore', 'q','./codes.model'], function($, _, q, codes){
	var config = codes.DEV;

	return {
		
		//To load the list of vehicles
		//api/v1/app/vehicle
		get: function(){
			var deferred = $.ajax({
				type : "GET",
				url : [config.HOST, 'api/v1/app/vehicle'].join('/')
			});

			return deferred;
		},

		//To register a new vehicle
		//api/v1/app/vehicle/:id
		post: function(vehicle){
			var deferred = $.ajax({
				type : "POST",
				url : [config.HOST, 'api/v1/app/vehicle', vehicle].join('/')
			});

			return deferred;
		},

		//To register a new vehicle
		//api/v1/app/vehicle/:id
		del: function(vehicle){
			var deferred = $.ajax({
				type : "DELETE",
				url : [config.HOST, 'api/v1/app/vehicle', vehicle].join('/')
			});

			return deferred;
		}
	};
});