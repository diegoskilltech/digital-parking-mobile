/**
 * Login application view
 */
define(['jquery', 'underscore', 'handlebars', '../model/user.model'], function($, _, handlebars, userModel){
	
	//Class definition
	var LoginPage = function(page){
		console.log('LOGIN PAGE LOADED -->');
		this.el = $(page.container);

		this.bindEvents();

		return this;
	};

	//To bind page element events
	LoginPage.prototype.bindEvents = function(){
		var self = this;
		this.el.find('[data-action=login]').on('click', function(){
			var user = self.serialize();
			console.log('About to login user.... ' + JSON.stringify(user));

			userModel
				.signin(user)
				.done(function(data){
					console.log('Loggedin ' + JSON.stringify(data));

					if(data && data.code == "200"){
						user.name = data.messsage;
						userModel.cacheUser(user);
						self.notifyError();
						ParkingApp.Event.trigger('user-logedin');
					}
					else
						self.notifyError(data);
				})

				.fail(function(err){
					self.notifyError(err);	
				});
		});
	};

	//To bind page element events
	LoginPage.prototype.serialize = function(){
		var user = {};
		this.el.find('input[type=email], input[type=password], select').each(function(){
			el = $(this);
			var name = el.attr('name');
			var value = el.val();
			user[name] = value;
		});

		return user;
	};

	LoginPage.prototype.notifyError = function(data){

		var el = this.el.find('.error-message')
			.empty();

		if(data){
			console.log('NOTIFYING Error ' + data.messsage);
			el.text(data.messsage);
		}
	};

	return LoginPage;
});