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
    	}
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['./app/parking.app'], function(ParkingApp){
	console.log('INDEX App initialization...');

	ParkingApp.initialize();
});