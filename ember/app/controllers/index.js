import Ember from 'ember';
import SessionMixin from '../mixins/session';
export default Ember.Controller.extend(SessionMixin, {

	//queryParams
	queryParams: ['alreadyLoggedIn', 'logoutSuccess'],

	//properties
	loginSuccess: null,
	logoutSuccess: null,
	alreadyLoggedIn: null,
	isLoading: null,
	itemCreationSuccessfull: null,
	itemCreationFail: null,
	itemTitle: null,
	itemUrl: null,

	actions: {

		createItem: function() {

			//create item
			var item = this.store.createRecord('item', {});

			//add properties
			item.setProperties({
				title: itemTitle,
				url: itemUrl
			});

			//setup callbacks for after user request is sent
      var _this = this;
      var onSuccess = function(item){
        //reset properties
        _this.set('isLoading', false);
        _this.set('itemCreationSuccessfull', false);
        _this.set('registrationSuccessful', true);
      };

      var onFail = function(response) {
        if (response["errors"]["code"] === 'bad') {
          _this.set('codeBad', true);
          _this.set('isLoading', false);
          _this.set('registrationFailed', false);
          _this.set('registrationSuccessful', false);
        } else {
          _this.set('isLoading', false);
          _this.set('registrationFailed', true);
          _this.set('registrationSuccessful', false);
        }
      };

			//create item
      item.save().then(onSuccess,onFail);
		}
	}
});