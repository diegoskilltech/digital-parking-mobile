//Make ButtonApp globally available
var ButtonApp = null;

define(['jquery', 'underscore', 'handlebars', './model/connection.model', './model/codes.model'], function($, _, handlebars, ConnectionModel, CodesModel){

	ButtonApp = {
		//F7 app container
		app: null,
		conn: null,

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

			//Create and initialize the xmpp connection
			this.conn = ConnectionModel
							.initialize()
							.connect();
		},

		// Bind Event Listeners
		bindEvents: function() {
			document.addEventListener('deviceready', _.bind(this.receivedEvent, this, null, 'Dispositivo preparado'), false);
			document.addEventListener('volumedownbutton', _.bind(this.receivedEvent, this, null, 'call-emergency'), false);
			ButtonApp.Event.on('log-message', _.bind(this.receivedEvent, this));

			$('[data-action=call]').on('click', _.bind(this.doCall, this));

			ButtonApp.Event.on('xmpp-message', _.bind(this.onResponse, this));
		},

		// Update DOM on a Received Event
		receivedEvent: function(e, msg) {
			this.log.text(msg);
			console.log('Received Event: ' + msg);
		},

		//To execute the call
		doCall: function(e){
			console.log('CALLING...');
			var el = $(e.currentTarget);
			var to = el.attr('data-to');
			this.conn.send(to, 'PIRULO');
		},

		//To handle the response
		onResponse: function(e, msg){
			var which = CodesModel.CALLTYPES_BY_CODE[msg.toCall];
			var status = this.status[msg.status]();
			var container = $(['[data-to=', which, ']'].join(''));
			container.remove('.status-icon').append(status);

			navigator.vibrate(200);
		}
	};

	//Define the Event Dispatcher
	ButtonApp.Event = {
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

	return ButtonApp;
});