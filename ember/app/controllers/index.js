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

			//add loading spinner
			this.set('isLoading', true);

			//add properties
			item.setProperties({
				title: this.get('itemTitle'),
				url: this.get('itemUrl')
			});

			//setup callbacks for after user request is sent
      var _this = this;
      var onSuccess = function(item){
      	//close model
      	Ember.$('#newItem').modal('hide');

        //reset properties
        _this.set('isLoading', false);
        _this.set('itemCreationFail', false);
        _this.set('itemCreationSuccessfull', true);
        //remove created message after a few seconds
        setTimeout(function(){ _this.set('itemCreationSuccessfull', false);}, 3000);
      };

      var onFail = function(response) {
        //reset properties
        _this.set('isLoading', false);
        _this.set('itemCreationFail', true);
        _this.set('itemCreationSuccessfull', false);
      };

			//create item
      item.save().then(onSuccess,onFail);
		}
	}
});