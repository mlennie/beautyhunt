import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(transition) {

    //add redirect to index if already logged in
    if (window.localStorage.getItem('session')) {
      this.transitionTo('index', { queryParams: {alreadyLoggedIn: true}});
    }
  },

  resetController: function (controller, isExiting, transition) {
    if (isExiting) {
      // isExiting would be false if only the route's model was changing
      //reset messages
      controller.setProperties({
        editSuccess: false,
        loginError: false,
        confirmation_success: false,
        confirmation_fail: false,
        isLoading: false
      });
    }
  }
});