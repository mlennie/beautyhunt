import Ember from 'ember';
import ENV from "beauty-ember/config/environment";
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
	beautyProducts: null,
	clothes: null,
	shoes: null,
	accessories: null,

	//computed properties


	actions: {

		showLoginMessage: function() {				
			var _this = this;
			_this.set('loginMessage', true);
			setTimeout(function(){ _this.set('loginMessage', false);}, 3000);
		},

		createItem: function() {
 			var _this = this;

			//get tags
			var tags = [];
			if (this.get('beautyProducts')) {tags.push("beautyProducts")};
			if (this.get('clothes')) {tags.push("clothes")};
			if (this.get('shoes')) {tags.push("shoes")};
			if (this.get('accessories')) {tags.push("accessories")};

			//add loading spinner
			this.set('isLoading', true);

			//create item
			var item = this.store.createRecord('item', {
				title: this.get('itemTitle'),
				url: this.get('itemUrl')
			});

			//setup callbacks for after user request is sent
     
      var onSuccess = function(){
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
      // Custom ajax call for resending . 
      Ember.$.ajax({
        url: ENV.APP.API_URL + '/api/items',
        type: 'POST',
        data: {
          title: this.get('itemTitle'), 
          url: this.get('itemUrl'),
          tags: tags
        }
        
      //callbacks
      }).then(onSuccess, onFail);
		}
	}
});