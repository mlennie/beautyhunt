import Ember from 'ember';
import SessionMixin from '../mixins/session';
export default Ember.Controller.extend(SessionMixin, {

	//queryParams
	queryParams: ['loginSuccess','alreadyLoggedIn', 'logoutSuccess'],

	//properties
	loginSuccess: null,
	logoutSuccess: null,
	alreadyLoggedIn: null
});