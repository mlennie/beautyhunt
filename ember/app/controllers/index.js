import Ember from 'ember';
export default Ember.Controller.extend({

	//queryParams
	queryParams: ['loginSuccess','alreadyLoggedIn', 'logoutSuccess'],

	//properties
	loginSuccess: null,
	logoutSuccess: null,
	alreadyLoggedIn: null
});