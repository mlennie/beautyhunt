import Ember from 'ember';
import ENV from "beauty-ember/config/environment";

export default Ember.View.extend({
	
	toggleFilterSelect: function() {
		//toggle tags-select when click filter button
		Ember.$('#filter-button').on('click', function(){
			Ember.$('#filter-select').toggle();
		});
	}.on('didInsertElement'),

	//add new filter when select a filter from filter select
	addFilter: function() {
		var _this = this;
		Ember.$('#filter-select > p').on('click', function() {
			var tag = Ember.$(this).data('tag');
			_this.get('controller.filters').pushObject(tag);
			Ember.$('#filter-select').toggle();
		});
	}.on('didInsertElement')
});