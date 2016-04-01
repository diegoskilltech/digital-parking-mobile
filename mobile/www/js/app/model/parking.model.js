/**
 * USER MODEL
 */
define(['jquery', 'underscore', 'q','./codes.model'], function($, _, q, codes){
	var config = codes.DEV;

	return {

		//To get users current location
		getCurrentPosition: function(){
			var deferred = 
				(function(){
					var deferred = q.defer();
					navigator.geolocation.getCurrentPosition(
						//onSuccess
						function(position){
							console.log('GPS location ' + JSON.stringify(position));
							deferred.resolve(position);
						}, 
						//onError
						function(err){
							deferred.reject(err)
						});
					return deferred.promise;
				})();

			return deferred;
		},

		//To signin a given user
		//api/v1/app/free/locations?lat=-34.629475&lon=-58.445241
		getFreeLocations: function(){

			var deferred = 
				(function(){
					var deferred = q.defer();
					navigator.geolocation.getCurrentPosition(
						//onSuccess
						function(position){
							console.log('GPS location ' + JSON.stringify(position));
							deferred.resolve(position);
						}, 
						//onError
						function(err){
							deferred.reject(err)
						});
					return deferred.promise;
				})()

				.then(function(position){
					return $.ajax({
						type : "GET",
						url : [config.HOST, 'api/v1/app/free/locations'].join('/'),
						data: $.param({lat: position.coords.latitude, lon: position.coords.longitude})
					});
				});

			return deferred;
		},

		//To load parking history
		//api/v1/app/parking/history
		getHistory: function(){
			var deferred = $.ajax({
				type : "GET",
				url : [config.HOST, 'api/v1/app/parking/history'].join('/')
			});

			return deferred;
		},

		//To load penalties history
		//api/v1/app/parking/penalties
		getPenalties: function(){
			var deferred = $.ajax({
				type : "GET",
				url : [config.HOST, 'api/v1/app/parking/penalties'].join('/')
			});

			return deferred;
		},

		//To register a new user
		//api/v1/app/start_parking/{time_min}/{codLocation}/{dominio}/{amount}/{idPaymentTransaction}?lat=xxxx&lon=xxxx
		park: function(parking){
			var deferred = $.ajax({
				type : "POST",
				url : [config.HOST, 'api/v1/app/start_parking', parking.time, parking.locationId, parking.vehicle, parking.amount, parking.transactionId].join('/'),
				data: $.param(_.pick(parking, 'lat', 'lon'))
			});

			return deferred;
		}
	};
});