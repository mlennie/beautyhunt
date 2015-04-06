import Ember from 'ember';

export default Ember.Controller.extend({
  //queryParams

  //properties
  registrationSuccessful: false,
  registrationFailed: false,
  passwordTooShort: false,
  passwordMismatch: false,
  username: null,
  email: null,
  password: null,
  passwordConfirmation: null,
  isLoading: false,

  //computed properties
  user: function(){
    return this.store.createRecord('user', {});
  }.property(),

  //actions
  actions: {
  
    registerUser: function() {
      //check client side validations
      if (this.get('password').length < 6) {
        //set new warning
        this.set('passwordTooShort', true);
      } else if (this.get('password') !== this.get('passwordConfirmation')) {
        //remove old warnings
        this.set('passwordTooShort', false);
        //add new warning
        this.set('passwordMismatch', true);
      } else { 
        //send create request

        //add loading spinner
        this.set('isLoading', true);
        
        //remove error warnings
        this.setProperties({
          passwordMismatch: false,
          passwordTooShort: false
        });

        //set user
        var user = this.get('user');

        //set new attributes
        user.setProperties({
          email: this.get('email'),
          username: this.get('username'),
          password: this.get('password'),
          passwordConfirmation: this.get('passwordConfirmation')
        });

        //setup callbacks for after user request is sent
        var _this = this;
        var onSuccess = function(){
          _this.set('isLoading', false);
          _this.set('registrationFailed', false);
          _this.set('registrationSuccessful', true);
        };

        var onFail = function() {
          _this.set('isLoading', false);
          _this.set('registrationFailed', true);
          _this.set('registrationSuccessful', false);
        };

        //send user update request
        user.save().then(onSuccess,onFail);
      }
    }
  }
});