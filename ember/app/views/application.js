import Ember from 'ember';
import ENV from "beauty-ember/config/environment";

export default Ember.View.extend({
	
	loadFacebookSDK: function() {
		window.fbAsyncInit = function() {
	    FB.init({
	      appId      : ENV.APP.FACEBOOK_ID,
	      xfbml      : true,
	      version    : 'v2.3'
	    });

	    FB.getLoginStatus(function(response) {
	    	window.localStorage.setItem('facebookStatus', response.status);
		  });
	  };

	  (function(d, s, id){
	     var js, fjs = d.getElementsByTagName(s)[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement(s); js.id = id;
	     js.src = "//connect.facebook.net/en_US/sdk.js";
	     fjs.parentNode.insertBefore(js, fjs);
	   }(document, 'script', 'facebook-jssdk'));

	}.on('didInsertElement'),

	setStyle: function() {
		var style = window.localStorage.getItem('style');
		
		if (style) {
			//remove last class and set new one to set global style
      Ember.$('#main-container').removeClass();
      Ember.$('#main-container').addClass(style);
		}
	}.on('didInsertElement')
});