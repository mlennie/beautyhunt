import Ember from 'ember';
import ENV from "beauty-ember/config/environment";
import AuthenticationMixin from '../../mixins/authentication';
export default Ember.Controller.extend(AuthenticationMixin,{

	//queryParams
	queryParams: ['confirmation_success','confirmation_fail', 
								'editSuccess', 'password_change_success'],

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
      	window.localStorage.setItem('login', true);
      	
      	//transition to index
        controller.set('isLoading', false);
        
        // send to index page and reload page
	      window.location.href = ENV.APP.EMBER_URL;

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






