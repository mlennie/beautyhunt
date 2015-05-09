import Ember from 'ember';
import ENV from "beauty-ember/config/environment";
export default Ember.ObjectController.extend({
	//model is an id so get tag from id
	tag: function() {
		return this.store.getById('tag', this.get('model'));
	}.property('model')
});