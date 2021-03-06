import Ember from 'ember';
import ENV from "beauty-ember/config/environment";

export default Ember.View.extend({
	
	toggleFilterSelect: function() {
		Ember.$('body').on('click', function() {
			Ember.$('#filter-select').hide();
		});
		//toggle tags-select when click filter button
		Ember.$('body').on('click', '#filter-button', function(e){
			e.preventDefault();
			e.stopPropagation();
			Ember.$('#filter-select').toggle();
		});
	}.on('didInsertElement'),

	//add new filter when select a filter from filter select
	addFilter: function() {
		var _this = this;
		Ember.$('#filter-select > p').on('click', function() {
			var tagId = Ember.$(this).data('tag');
			_this.get('controller.filters').pushObject(tagId);
			Ember.$('#filter-select').toggle();
		});

		
	}.on('didInsertElement')
});