import Ember from 'ember';

export default Ember.Route.extend({

	setupController: function(controller) {
    controller.setProperties({
    	registrationSuccessful: false,
    	registrationFailed: false,
    	passwordMismatch: false,
    	passwordTooShort: false,
      isLoading: false
    });
  }
});