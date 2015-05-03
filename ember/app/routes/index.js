import Ember from 'ember';

export default Ember.Route.extend({

  resetController: function (controller, isExiting) {
    
    if (isExiting) {
      // isExiting would be false if only the route's model was changing
      //reset messages
      controller.setProperties({
        loginSuccess: null,
        logoutSuccess: null,
        alreadyLoggedIn: null
      });
    }
  },

  setupController: function(controller, model) {
    if (window.localStorage.getItem('login')) {
      window.localStorage.removeItem('login');
      controller.set('loginSuccess', true);
    }
   
    this._super(controller, model);
  }
});
