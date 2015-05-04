import Ember from 'ember';
import SessionMixin from '../mixins/session';
export default Ember.ArrayController.extend(SessionMixin, {
	sortProperties: ['created_at:desc'],
  sortedItems: Ember.computed.sort('model', 'sortProperties'),

	//queryParams
	queryParams: ['alreadyLoggedIn', 'logoutSuccess'],

	//properties
	loginSuccess: null,
	logoutSuccess: null,
	alreadyLoggedIn: null,
	isLoading: null,
	loginMessage: null,
	itemCreationSuccessfull: null,
	itemCreationFail: null,
	itemCreateFailMessage: "Oops looks like there was a problem. Couldn't create item.",
	itemTitle: null,
	itemUrl: null,

	//computed properties


	actions: {

		showLoginMessage: function() {				
			var _this = this;
			_this.set('loginMessage', true);
			setTimeout(function(){ _this.set('loginMessage', false);}, 3000);
		},

		createItem: function() {
 			var _this = this;

			//create item
			var item = this.store.createRecord('item', {});

			//add loading spinner
			this.set('isLoading', true);

			//add properties
			item.setProperties({
				title: this.get('itemTitle'),
				url: this.get('itemUrl')
			});

			//setup callbacks for after user request is sent
     
      var onSuccess = function(item){
      	//close model
      	Ember.$('#newItem').modal('hide');

        //reset properties
        _this.set('isLoading', false);
        _this.set('itemCreationFail', false);
        _this.set('itemCreationSuccessfull', true);
        _this.set('itemTitle', null);
        _this.set('itemUrl', null);
        //remove created message after a few seconds
        setTimeout(function(){ _this.set('itemCreationSuccessfull', false);}, 3000);
      };

      var onFail = function(response) {

      	//handle errors
      	if (response.responseJSON && response.responseJSON.errors) {
      		var errors = response.responseJSON.errors;
      		var errorName = Object.keys(errors)[0];
      		var errorReason = errors[errorName];

      		_this.set('itemCreateFailMessage', errorReason);
      	}
      	
        //reset properties
        _this.set('isLoading', false);
        _this.set('itemCreationFail', true);
        _this.set('itemCreationSuccessfull', false);
      };

			//create item
      item.save().then(onSuccess(item),onFail);
		}
	}
});