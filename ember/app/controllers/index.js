import Ember from 'ember';
export default Ember.Controller.extend({

	//queryParams
	queryParams: ['loginSuccess','alreadyLoggedIn'],

	//properties
	loginSuccess: null,
	alreadyLoggedIn: null
});