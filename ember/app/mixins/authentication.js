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
		  	// Custom ajax call for resending . 
	      Ember.$.ajax({
	        url: ENV.APP.API_URL + '/api/users/auth/facebook',
	        type: 'POST',
	        data: response

	      }).then(facebookSuccess(response), facebookFail());
		  }

		  function facebookSuccess (response) {
				alert('sucess!');
		  }

		  function facebookFail () {
		  	alert('fail');
		  }
		}
  }
});