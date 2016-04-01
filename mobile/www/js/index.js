//Require base path configuration
requirejs.config({
    baseUrl: 'js/libs',
    paths: {
        app: '../app'
    },

    shim: {
    	underscore: {
    		exports: '_'
    	},

    	handlebars: {
    		exports: 'Handlebars'
    	},

        q: {
            exports: 'q'
        },

        moment: {
            exports: 'moment'
        }
    }
});

//Instantiate the app as soon as posible
var ParkingApp = {
    app: new Framework7({material: true})
}
ParkingApp.app.showPreloader('Iniciando...');

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['./app/parking.app'], function(ParkingApp){
	console.log('INDEX App initialization...');

	ParkingApp.initialize();
});