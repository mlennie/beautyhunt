import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
	this.resource('users', function() {
		this.route('login');
	  this.route('register');
	  this.route('new-password');
	  this.route('edit-password');
	  this.route('resend-confirmation');
    this.route('edit');
    this.route('show');
  });
});
