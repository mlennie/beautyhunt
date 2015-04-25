import Ember from "ember";
import ENV from "beauty-ember/config/environment";
export default Ember.Mixin.create({
	//computed properties
  //actions
  actions: {
  	authenticateWithFacebook: function() {

			var _this = this;
			
			FB.getLoginStatus(function(response) {
		    statusChangeCallback(response, "check");
		  });

		  function statusChangeCallback(response, step) {

		    if (response.status === 'connected') {
		      FB.api('/me', function(response) {
			    	sendToServer(response);
					});
		    } else {
		    	if (step === "check") {
			    	FB.login(function(response) {
			    		statusChangeCallback(response, "login");
				    }, {scope: 'public_profile,email'});
			    } else {
			    	alert("you were not logged in");
			    }
		    }
		  }

		  function sendToServer(response) {
		  	var _this = this;

		  	// Custom ajax call for resending . 
	      Ember.$.ajax({
	        url: ENV.APP.API_URL + '/api/users/auth/facebook',
	        type: 'POST',
	        data: response

	      }).then(function(response) {
	      	//set session info to local storage
	      	var session = {
	      		user_token: response.token,
	      		user_id: response['user']['_id']
	      	};

	      	window.localStorage.setItem('session', JSON.stringify(session));
	        
	        // send to index page and reload page
		      window.location.href = ENV.APP.EMBER_URL + "?loginSuccess=true";
	      }, function() {
	      	alert('Connection through facebook did not work. Please try again soon.');
	      });
		  }
		}
  }
});