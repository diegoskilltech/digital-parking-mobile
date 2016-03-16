define(['strophe', 'underscore', './codes.model'], function(StropheModule, _, CodesModel){
	var Strophe = StropheModule.Strophe;

	/**
	 * Connection Model to handle XMPP connections with server
	 */

	//Connection object model
	return {
		BOSH_SERVICE: 'http://botonalerta.com:5280/http-bind/',
		BOSH_DOMAIN: 'demomonitor.org',
		USER: 'juliet',
		PASSWORD: 'R0m30',
		connection: null,

		//Initialize the model
		initialize: function(){

			this.connection = new Strophe.Connection(this.BOSH_SERVICE);
			this.connection.rawInput = _.bind(this.rawInput, this);
			this.connection.rawOutput = _.bind(this.rawOutput, this);

			return this;
		},

		//To connect to the service
		connect: function() {
			this.connection.connect([this.USER, this.BOSH_DOMAIN].join('@'), this.PASSWORD, _.bind(this.onConnect, this));

			return this;
		},

		//To disconnect to the service
		disconnect: function() {
			this.connection.disconnect();

			return this;
		},

		//To send a message
		//@param to (type of CALLTYPES)
		send: function(to, from){
			to = CodesModel.CALLTYPES[to];

			var body = JSON.stringify({
				"from": from,
				// dd/MM/yyyy HH:mm:ss
				"fecha": "01/03/2016 17:00:00",
				"toCall": to,
				"latitude":99.2,
				"longitude":2028.2,
				"status": 2
			});

			var stanza = StropheModule.$msg({
					from: [this.USER, this.BOSH_DOMAIN].join('@'),
					to: ['test', this.BOSH_DOMAIN].join('@'), 
					type: "chat"
				})
                .c("body")
                .t(body);

            this.log('Enviando alerta...');

            //Register the handler, since is cleared once the message is processed
			this.connection.addHandler(_.bind(this.onMessage, this), null, 'message', null, null,  null); 

			//Send the stanza
            this.connection.send(stanza.tree()); 
		},

		//To log on console element
		log: function (msg) {
			ButtonApp.Event.trigger('log-message', msg);
		},

		//To handle the protocol input
		rawInput: function(data){
			console.log('===>> STROPHE RECV: ' + data);
		},

		//To handle the protocol output
		rawOutput: function(data){
			console.log('===>> STROPHE SENT: ' + data);
		},

		//Connection handler
		onConnect: function(status){
			if (status == Strophe.Status.CONNECTING) {
				this.log('Conectando con el centro de operaciones...');
				ButtonApp.Event.trigger('xmpp-connecting');

			} else if (status == Strophe.Status.CONNFAIL) {
				this.log('Fallo al intentar conectar');
				ButtonApp.Event.trigger('xmpp-connection-failed');

			} else if (status == Strophe.Status.DISCONNECTING) {
				this.log('Desconectando del centro de operaciones');
				ButtonApp.Event.trigger('xmpp-disconnecting');

			} else if (status == Strophe.Status.DISCONNECTED) {
				this.log('Centro de operaciones no conectado');
				ButtonApp.Event.trigger('xmpp-disconnected');

			} else if (status == Strophe.Status.CONNECTED) {
				this.log('Centro de operaciones conectado');
				ButtonApp.Event.trigger('xmpp-connected');
			}
		},

		//Message raw hanlder
		onMessage: function(msg){
			msg = $(msg);
			var body = JSON.parse(msg.find('body').text());
			console.log('===>> STROPHE ON MESSAGE: ', body);
			ButtonApp.Event.trigger('xmpp-message', body);

			this.log(CodesModel.MSG_STATUS_DESCRIPTION[body.status]);
		}
	};
});