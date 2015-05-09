import Ember from 'ember';
import ENV from "beauty-ember/config/environment";
import SessionMixin from '../mixins/session';
import AuthenticationMixin from '../mixins/authentication';
export default Ember.Controller.extend(
  //mixins
  SessionMixin, 
  AuthenticationMixin, {

	actions: {
    changeStyle: function(newClass) {

      //remove last class and set new one to set global style
      Ember.$('#main-container').removeClass();
      Ember.$('#main-container').addClass(newClass);

      //add to session so will remember
      window.localStorage.setItem('style', newClass);
    },

		invalidateSession: function() {
			// Custom ajax call for resending . 
      Ember.$.ajax({
        url: ENV.APP.API_URL + '/api/users/logout',
        type: 'POST'
        
      //successful login callback
      }).then(function(response){

      	//set session info to local storage
      	window.localStorage.removeItem('session');
      	window.localStorage.removeItem('currentUser');
        
        // send to index page and reload page
	      window.location.href = ENV.APP.EMBER_URL + "?logoutSuccess=true";

      //unsuccessful login callback
      }, function(){
        //set session info to local storage
      	window.localStorage.removeItem('session');
      	window.localStorage.removeItem('currentUser');
        
        // send to index page and reload page
	      window.location.href = ENV.APP.EMBER_URL;
      });
		}
	}
});