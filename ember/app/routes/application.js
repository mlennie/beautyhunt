import Ember from 'ember';

export default Ember.Route.extend({

  model: function(){

  	//if session is stored in local storage get user and set a currentUser
  	//to the session
  	if (window.localStorage.getItem('session')) {
  		var stringSession = window.localStorage.getItem('session');

		  Ember.$.ajaxSetup({
		    headers: {
		      'x-access-token': stringSession
		    }
		  });

  		var session = JSON.parse(window.localStorage.getItem('session'));
  		
			return this.store.find("user", session.user_id).then(function(user) {
        var currentUser = {
      		id: session.user_id,
      		email: user.email
      	};

      	window.localStorage.setItem(
      		'session.currentUser', 
      		JSON.stringify(currentUser)
      	);
      });
    }
	}
});
