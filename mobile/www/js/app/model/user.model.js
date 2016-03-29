/**
 * USER MODEL
 */
define(['jquery', 'underscore', 'codes.model'], function($, _, codes){
	var config = codes.DEV;

	return {

		//To register a new user
		//security/api/v1/app/signup/{mobileNumber}/{name}/{imei}?user=xxx@xx.com&password=password
		signup: function(user){
			var deferred = $.ajax({
				type : "POST",
				url : [config.HOST, config.CONTEXT, 'security/api/v1/app/signup', user.number, user.name, user.imei].join('/'),
				data: {user: user.id, password: user.password}
			});

			return deferred.promise();
		}
	};
});