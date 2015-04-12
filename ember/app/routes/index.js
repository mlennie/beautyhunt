import Ember from 'ember';

export default Ember.Route.extend({

  resetController: function (controller, isExiting, transition) {
    if (isExiting) {
      // isExiting would be false if only the route's model was changing
      //reset messages
      controller.setProperties({
        loginSuccess: null
      });
    }
  }
});
