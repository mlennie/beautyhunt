import Ember from 'ember';

export default Ember.Controller.extend({

	//queryParams
	queryParams: ['confirmation_success','confirmation_fail', 'editSuccess'],

	//properties
	identification: null,
	editSuccess: false,
	password: null,
	loginError: false,
	confirmation_success: false,
	confirmation_fail: false,
	isLoading: false,

	//actions
	actions: {
		authenticate: function() {

			var controller = this;
			controller.setProperties({
				confirmation_success: false,
				confirmation_fail: false,
				loginError: false,
				isLoading: true
			});

			//set authentication data to send to rails
			var data = this.getProperties('identification', 'password');
			this.get('session').authenticate(this.get('authenticator'), data).then(function() {
				

				controller.setProperties({
					isLoading: false
				});
			}, function() {
				//show authenticate error if authentication not good
				controller.setProperties({
					loginError: true, 
					password: null,
					isLoading: false,
					editSuccess: false
				});
			});
		}
	}
});