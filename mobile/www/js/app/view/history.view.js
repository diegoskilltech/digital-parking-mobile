/**
 * History application view
 */
define(['jquery', 'underscore', 'handlebars', 'moment', '../model/parking.model', '../model/codes.model'], function($, _, handlebars, moment, parkingModel, codesModel){
	var config = codesModel.DEV;
	
	//Class definition
	var HistoryPage = function(page){
		console.log('VEHICLE PAGE LOADED -->');
		this.el = $(page.container);
		this.itemUl = this.el.find('#list-container').empty();

		this.template = handlebars.compile(this.el.find('#parking-template').html() || 'HISTORY TEMP');

		this.bindEvents();
		this.loadHistory();
	};

	//To bind interface events
	HistoryPage.prototype.bindEvents = function(){
		var self = this;
	};

	//To load the locations and build the options
	HistoryPage.prototype.loadHistory = function(){
		var template = this.template;
		var el = this.itemUl;

		parkingModel
			.getHistory()
			.done(function(parkings){
				parkings = _.map(parkings, function(item){
					item.date = moment(item.dateFrom).format('DD/MM/YYYY');
					return item;
				});
				el.empty().append(template(parkings));
			});
	};

	return HistoryPage;
});