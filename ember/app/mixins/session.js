import Ember from "ember";

export default Ember.Mixin.create({
	//computed properties
  currentUser: function() {
  	if (window.localStorage.getItem('session')) {
    	return JSON.parse(window.localStorage.getItem('session'));
    } else {
    	return null;
    }
  }.property()
});