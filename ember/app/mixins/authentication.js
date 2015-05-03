import Ember from "ember";
import ENV from "beauty-ember/config/environment";
export default Ember.Mixin.create({
	//property
	facebookStatus: null,
	
	//computed properties

  //actions
  actions: {
  	authenticateWithFacebook: function() {

			var _this = this;
			var facebookStatus = window.localStorage.getItem('facebookStatus');

	    if (facebookStatus === 'connected') {
	      FB.api('/me', function(response) {
		    	sendToServer(response);
				});
	    } else {
	    	FB.login(function(response) {
	    		if (response.status === 'connected') {
		    		FB.api('/me', function(response) {
				    	sendToServer(response);
						});
					} else {
						alert("you could not be logged in");
					}
		    }, {scope: 'public_profile,email'});
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
	      	window.localStorage.setItem('login', true);
	        
	        // send to index page and reload page
		      window.location.href = ENV.APP.EMBER_URL;
	      }, function() {
	      	alert('Connection through facebook did not work. Please try again soon.');
	      });
		  }
		}
  }
});