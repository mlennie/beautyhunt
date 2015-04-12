import Ember from 'ember';

export default Ember.View.extend({
	//send events to MIXPANEL
	applicationMixpanelEvents: function() {
		var session = window.localStorage.getItem('session');
 
		if (session) {
		  Ember.$.ajaxSetup({
		    headers: {
		      'x-access-token': session
		    }
		  });
		}
	}.on('didInsertElement')
});