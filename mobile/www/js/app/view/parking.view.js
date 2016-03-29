/**
 * Parking application view
 */
define(['jquery', 'underscore', 'handlebars'], function($, _, handlebars){
	
	//Class definition
	var ParkingPage = function(page){
		console.log('PARKING PAGE LOADED -->');
		var $$ = Dom7;
		var scanTimeOut = null;
		(el = $$(page.container)).find('[data-action=scan-location-code]').on('click', function(){
			console.log('SCAN CODE CLICKED!!!!!!');
			try{

				if(!scanTimeOut){

					scanTimeOut = true;
					cordova.plugins.barcodeScanner.scan(
						function (result) {
							console.log("We got a barcode\n" +
							"Result: " + result.text + "\n" +
							"Format: " + result.format + "\n" +
							"Cancelled: " + result.cancelled);

							scanTimeOut = null;
							if(result.text){
								try{
									var qr = JSON.parse(result.text);
									el.find("[name=location]").val(qr.location);
								}catch(err){
									console.warn(err);
								}
								
							}
						}, 
						function (error) {
							alert("Scanning failed: " + error);
							scanTimeOut = null;
						}
					);
				}
			}catch(err){
				console.error(err);
			}
		});
	};

	return ParkingPage;
});