import Ember from 'ember';
import ENV from "beauty-ember/config/environment";
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

			// Custom ajax call for resending . 
      Ember.$.ajax({
        url: ENV.APP.API_URL + '/api/users/login',
        type: 'POST',
        data: {
          identification: this.get('identification'), 
          password: this.get('password')
        }
      }).then(function(){
        controller.set('isLoading', false);
        controller.transitionToRoute('index', { queryParams: {loginSuccess: true}});
      }, function(){
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