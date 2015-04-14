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

			if (window.localStorage.getItem('session')) {
				controller.transitionToRoute('index', { queryParams: {alreadyLoggedIn: true}});
			}

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
        
      //successful login callback
      }).then(function(response){

      	//set session info to local storage
      	var session = {
      		user_token: response.token,
      		user_id: response['user']['_id']
      	};

      	window.localStorage.setItem('session', JSON.stringify(session));
      	
      	//transition to index
        controller.set('isLoading', false);
        
        // send to index page and reload page
	      window.location.href = ENV.APP.EMBER_URL + "?loginSuccess=true";

      //unsuccessful login callback
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