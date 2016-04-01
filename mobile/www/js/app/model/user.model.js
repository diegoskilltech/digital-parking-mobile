/**
 * USER MODEL
 */
define(['jquery', 'underscore', './codes.model'], function($, _, codes){
	var config = codes.DEV;

	return {

		//To verify that the user is loggedin
		checkLoginStatus: function(){
			var user = localStorage.getItem('user');

			if(user){
				user = JSON.parse(user);
				this.signin(user)

				.done(function(data){
					if(data.code == "200")
						user.name = data.messsage;
						ParkingApp.User = user;
						ParkingApp.Event.trigger('user-logedin', user);
				});
			}else{
				ParkingApp.Event.trigger('user-notfound');
			}
		},

		//To signin a given user
		//{{host}}/{{context}}/security/api/v1/app/signin?user=&password=
		signin: function(user){
			var deferred = $.ajax({
				type : "POST",
				url : [config.HOST, 'security/api/v1/app/signin'].join('/'),
				data: $.param(user)
			});

			return deferred;
		},

		//To register a new user
		//security/api/v1/app/signup/{mobileNumber}/{name}/{imei}?user=xxx@xx.com&password=password
		signup: function(user){
			var deferred = $.ajax({
				type : "POST",
				url : [config.HOST, 'security/api/v1/app/signup', user.number, user.name, user.imei].join('/'),
				data: {user: user.id, password: user.password}
			});

			return deferred;
		},

		//To save the user object for later use
		cacheUser: function(user){
			ParkingApp.User = user;
			localStorage.setItem('user', JSON.stringify(user));
		}
	};
});