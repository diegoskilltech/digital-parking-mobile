/**
 * Penalty application view
 */
define(['jquery', 'underscore', 'handlebars', 'moment', '../model/parking.model', '../model/codes.model'], function($, _, handlebars, moment, parkingModel, codesModel){
	var config = codesModel.DEV;
	
	//Class definition
	var PenaltyPage = function(page){
		console.log('PENALTY PAGE LOADED -->');
		this.el = $(page.container);
		this.itemUl = this.el.find('#list-container').empty();

		this.template = handlebars.compile(this.el.find('#parking-template').html() || 'PENALTY TEMP');

		this.bindEvents();
		this.loadPenalty();
	};

	//To bind interface events
	PenaltyPage.prototype.bindEvents = function(){
		var self = this;
	};

	//To load the locations and build the options
	PenaltyPage.prototype.loadPenalty = function(){
		var template = this.template;
		var el = this.itemUl;

		parkingModel
			.getPenalties()
			.done(function(penalties){
				penalties = _.map(penalties, function(item){
					item.date = moment(item.date).format('DD/MM/YYYY');
					return item;
				});
				el.empty().append(template(penalties));
			});
	};

	return PenaltyPage;
});